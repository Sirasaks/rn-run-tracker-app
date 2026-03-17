# RN Run Tracker App

![App screenshot 1](https://img1.pic.in.th/images/6129e9e202c4bd613.jpg)

## 📱 สรุปโปรเจกต์
แอปนี้เป็นแอปติดตามการวิ่ง built ด้วย Expo + React Native (TypeScript) โดยมีเส้นทางหลักในโฟลเดอร์ `app/` และ UI components ใน `components/`.

## ⚙️ ฟีเจอร์หลัก
- บันทึก run ใหม่
- ดูสรุป run ที่บันทึกไว้
- เข้าสู่ระบบผู้ใช้
- ใช้งานมือถือทั้ง iOS/Android ด้วย Expo Go

## 🚀 เริ่มใช้งาน
1. ติดตั้ง dependencies

   ```bash
   npm install
   ```

2. เริ่ม Expo

   ```bash
   npx expo start
   ```

3. สแกน QR code ด้วย Expo Go หรือรันใน emulator

## 🔧 โครงสร้างโฟลเดอร์หลัก
- `app/` — หน้า route ของแอป
- `components/` — UI และคอมโพเนนต์ reusable
- `service/` — supabase API
- `constants/` — ธีมและค่าคงที่
- `types/` — TypeScript types

## 📷 ภาพตัวอย่างแอป

![App screenshot 2](https://img2.pic.in.th/594e841f96fa89d0e.jpg)

![App screenshot 3](https://img1.pic.in.th/images/4a0063ed7c7e7ed13.jpg)

![App screenshot 4](https://img2.pic.in.th/3f9968246f9e09ca0.jpg)

![App screenshot 5](https://img1.pic.in.th/images/230c4723f769cfeec.jpg)

![App screenshot 6](https://img2.pic.in.th/1c69cb3c478185d4d.jpg)

## 🧭 คำแนะนำเพิ่มเติม
- แก้ไขหน้าใน `app/` เพื่อปรับฟังก์ชันตามความต้องการ
- เชื่อมต่อ Supabase ใน `service/supabase.ts`
- ปรับธีมสีใน `constants/theme.ts`

## 📚 แหล่งอ้างอิง
- [Expo docs](https://docs.expo.dev)
- [React Native docs](https://reactnative.dev)

