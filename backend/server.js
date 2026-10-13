const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // อนุญาตให้ Frontend ยิง API ข้ามมาได้
app.use(express.json()); // แปลงข้อมูล JSON ใน Request body

// ข้อมูลจำลองใน Memory (Mock Data)
let proposals = [
  {
    id: 1,
    topicName: "ระบบเสนอหัวข้อโครงงานและติดตามสถานะ",
    studentName: "จักรพงศ์ (65xxxxxx)",
    advisorName: "อาจารย์ประจำสาขา",
    description: "ระบบช่วยยื่นเสนอหัวข้อและติดตามผลการพิจารณาโครงงาน",
    status: "pending"
  }
];

// 1. [GET] ดึงรายการหัวข้อทั้งหมด
app.get('/api/proposals', (req, res) => {
  res.status(200).json(proposals);
});

// 2. [POST] เพิ่มหัวข้อใหม่
app.post('/api/proposals', (req, res) => {
  const { topicName, studentName, advisorName, description } = req.body;

  if (!topicName || !studentName || !advisorName) {
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  const newProposal = {
    id: Date.now(),
    topicName,
    studentName,
    advisorName,
    description: description || "",
    status: "pending"
  };

  proposals.unshift(newProposal);
  res.status(201).json({ message: "ยื่นเสนอหัวข้อสำเร็จ", data: newProposal });
});

// 3. [DELETE] ลบหัวข้อตาม ID
app.delete('/api/proposals/:id', (req, res) => {
  const proposalId = parseInt(req.params.id);
  const exists = proposals.some(p => p.id === proposalId);

  if (!exists) {
    return res.status(404).json({ message: "ไม่พบข้อมูลที่ต้องการลบ" });
  }

  proposals = proposals.filter(p => p.id !== proposalId);
  res.status(200).json({ message: "ลบสำเร็จ" });
});

// เริ่มทำงานเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});