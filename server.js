import express from "express";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({limit:"1mb"}));
app.use(express.static(path.join(__dirname,"public")));

const client = process.env.OPENAI_API_KEY ? new OpenAI({apiKey:process.env.OPENAI_API_KEY}) : null;
const persona = `你是 AURA，一位動漫風格的魔法精靈 AI 夥伴。使用繁體中文，語氣溫柔、自然、有陪伴感，不要過度撒嬌。
你同時是生活助理與多款遊戲助手。生活問題要清楚、實用；遊戲問題先確認遊戲版本、平台、角色或目前進度等必要條件，不確定的資訊要坦白，不可捏造最新版本、掉落率或攻略數據。
尊重使用者自主性，不宣稱自己有真實情感或能在背景自行監控手機。遇到需要即時資料的遊戲問題，說明需要查證。回答以繁體中文為主。`;

app.get("/api/health", (_req,res)=>res.json({ok:true,aiConfigured:Boolean(client)}));
app.post("/api/chat", async (req,res)=>{
  try {
    if(!client) return res.status(503).json({error:"後端尚未設定 OPENAI_API_KEY。請依 README 設定 .env。"});
    const {message,kind="chat",history=[],nickname=""}=req.body||{};
    if(typeof message!=="string"||!message.trim()) return res.status(400).json({error:"訊息不可空白。"});
    const mode = kind==="game" ? "目前是遊戲助手模式。請先整理問題、列出可執行步驟；資訊不足時詢問最關鍵的一項。避免假裝能直接讀取或操控遊戲。" : "目前是日常陪伴模式。自然對話，必要時給出具體且不誇大的生活建議。";
    const safeHistory=Array.isArray(history)?history.slice(-12).filter(x=>["user","assistant"].includes(x.role)&&typeof x.content==="string").map(x=>({role:x.role,content:x.content.slice(0,4000)})):[];
    const response=await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-6-luna",
      instructions: persona+"\\n"+mode+(nickname?"\\n使用者希望被稱呼為："+nickname:""),
      input:[...safeHistory,{role:"user",content:message.slice(0,8000)}],
      max_output_tokens:900
    });
    res.json({reply:response.output_text||"我剛剛沒有整理出回覆，可以再問我一次嗎？"});
  } catch(err) {
    console.error("AURA API error:",err?.message||err);
    res.status(500).json({error:"AI 服務發生錯誤，請稍後再試。"});
  }
});
app.listen(port,()=>console.log(`AURA 2.0 running at http://localhost:${port}`));
