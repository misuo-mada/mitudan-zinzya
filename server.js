import express from 'express';
import 'dotenv/config'; // .envファイルを読み込む
import { Configuration, OpenAIApi } from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

// 必要な初期化
const app = express();
const PORT = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contents_Joho = 'あなたは、長いこと村に住んでいる妖怪です。話し方は馴れ馴れしい、子供っぽい性格です。時々、「ケケケッ！」と笑います。語尾は「～かな？」「～しよう」といった言葉を多用します。あなたは、今は、事件のことについて、白石と会話しています。また、あなたは、次のような事件の登場人物です。「江戸時代、山奥にある「影笠村」では、百年に一度の「妖怪の夜祭り」が開かれます。この祭りは、妖怪たちの怒りを鎮めるため、村の人間を生贄として殺し、その死体を神社の境内に捧げるという奇怪な風習がありました。今年、生贄に選ばれたのは、村の神社に仕える巫女の白石七重でした。しかし、祭り前日、村の猟師である赤井が神社の境内で殺害されているのが発見されました。」また、あなたは、事件の手がかりとして、事件当日、神社に３人の人間が来て、争っていたのを見ました。';

// OpenAI APIの設定
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // 環境変数からAPIキーを取得
});
const openai = new OpenAIApi(configuration);

// 静的ファイルの配信
app.use(express.static(path.join(__dirname, 'public')));

// JSONリクエストを処理
app.use(express.json());

// ChatGPT APIとの通信エンドポイント
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;

  try {
    // OpenAI APIを使用して応答を取得
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: contents_Joho },
        { role: 'user', content: prompt },
      ],
    });

    // 応答をクライアントに返す
    const reply = response.data.choices[0].message.content;
    console.log('OpenAI APIの応答:', reply);
    res.json({ reply });
  } catch (error) {
    // エラー時のログ出力とクライアントへのエラーメッセージ
    console.error('サーバーエラー:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'サーバー内部エラーが発生しました。' });
  }
});

// サーバーの起動
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});


