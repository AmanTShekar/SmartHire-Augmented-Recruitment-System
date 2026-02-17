---

<!-- SEO & SEARCH OPTIMIZATION -->
<!-- Keywords: AI Recruitment, Autonomous Hiring, Machine Learning, NLP, MediaPipe, Sentence-Transformers, FastAPI, React, Recruitment Automation, Bias-free Hiring -->

<div align="center">
  <img src="docs/assets/cover.png" alt="SmartHire Banner" width="100%">
  
  <h1>SmartHire 🚀</h1>
  <p><b>The Future of Autonomous Recruitment Protocol</b></p>

  <p>
    <img src="https://img.shields.io/badge/Version-1.0.0-blue.svg" alt="Version">
    <img src="https://img.shields.io/badge/License-PolyForm%20Noncommercial-blueviolet.svg" alt="License">
    <img src="https://img.shields.io/badge/Stack-FastAPI%20%7C%20React%20%7C%20AI-orange" alt="Stack">
    <img src="https://img.shields.io/badge/AI-MediaPipe%20%7C%20Whisper%20%7C%20SBERT-red" alt="AI">
  </p>

  <p align="center">
    <i>"Hire on Merit. Scale on AI. Built for the Next Generation of Talent."</i>
  </p>
</div>

---

## 🌟 Vision
**SmartHire** is a truly autonomous AI recruitment platform designed to eliminate human bias and identify top-tier talent through deep reasoning. We're moving beyond simple keyword matching to understanding *how* candidates think and solve problems.

## 🛠️ Core Technology Pillars

### 1. 🛡️ Zero Bias Protocol (PII Obfuscation)
Evaluates candidates purely as anonymous skill vectors. All Personally Identifiable Information (PII) is stripped at ingestion to ensure a 100% merit-based evaluation process.

### 2. 🧠 Deep Reasoning Engine
Powered by **DeepSeek-R1** and **L8 Chain-of-Thought (CoT)**, our engine evaluates candidate responses by tracing their logic, not just checking for keywords. It understands context, complexity, and problem-solving depth.

### 3. 👁️ Sentinel System (Biometric Analysis)
Leveraging **MediaPipe**, Sentinel tracks 468 facial landmarks at 60Hz during interviews to measure genuine engagement, cognitive load, and authenticity, ensuring an objective assessment of soft skills.

### 4. 🧬 Resonance Engine (Semantic Matching)
Utilizing **Sentence-Transformers (SBERT)**, the Resonance Engine creates 1536-dimensional vector embeddings of resumes and job descriptions. Unlike traditional ATS, it understands the *semantic relationship* between skills (e.g., knowing that 'FastAPI' and 'Web Frameworks' are related), leading to unprecedented matching accuracy.

---

## 🚀 Key Features

- 🤖 **Autonomous Screening**: JD-to-Criteria generation and initial AI-led interviews.
- 💻 **Technical Assessment**: Real-time coding challenges with deep logic evaluation.
- 🎤 **Audio/Video Intelligence**: Seamless transcription (Faster-Whisper) and behavioral analysis.
- 📊 **Insight Dashboard**: Real-time hiring metrics, bias detection reports, and quality-of-hire predictions.
- ⚡ **Neural Architecture**: Sharded interview processing for infinite horizontal scalability using Docker.

---

## 🏗️ Technical Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Backend** | [FastAPI](https://fastapi.tiangolo.com/) | High-performance Asynchronous API |
| **Frontend** | [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) | Sleek 'Void Black' Aesthetic UI |
| **Semantic AI** | [Sentence-Transformers](https://www.sbert.net/) | Resume-Job Semantic Alignment |
| **Computer Vision** | [MediaPipe](https://mediapipe.dev/) | Sentinel Biometric Tracking |
| **Speech** | [Faster-Whisper](https://github.com/guillaumekln/faster-whisper) | Low-latency Audio Transcription |
| **Ops** | [Docker](https://www.docker.com/) | Containerized Microservices & Scaling |

---

## 🚦 Getting Started

### 🐳 Quick Start with Docker
Docker is the recommended way to run SmartHire. It ensures all dependencies for AI libraries (like Sentence-Transformers and MediaPipe) are correctly configured.

```bash
# Clone the repository
git clone https://github.com/AmanTShekar/SmartHire-Augmented-Recruitment-System.git
cd SmartHire

# Build and start all services (Backend, Frontend, DB, Redis, Ollama)
docker-compose up --build
```
*Note: The first build will take a few minutes as it compiles AI dependencies.*

### 🧠 AI Model Setup
Since AI models are large (>500MB), they are not included in the repository. Run these scripts to populate your `backend/models` folder:

1. **Voice Models** (Kokoro, Moonshine):
   ```bash
   docker-compose exec backend python app/scripts/download_voice_models.py
   ```
2. **LLM Models** (Ollama):
   ```bash
   docker-compose exec backend python app/scripts/pull_models.py
   ```

---

## 🎯 Search & Optimization (SEO)
To find this project easily:
- `AI Recruitment System`
- `Autonomous Hiring Platform`
- `Sentence Transformers Resume Matcher`
- `MediaPipe Interview Analysis`
- `Bias-free AI Hiring`

---

## 📄 License
This project is licensed under the **PolyForm Noncommercial License 1.0.0**.

---

<div align="center">
  <p>Built with ❤️ by the SmartHire Team</p>
  <p><i>"Defining the next era of autonomous recruitment."</i></p>
</div>

- [x] **Q1: Foundation** - Core bias-free screening & Sentinel v1.
- [ ] **Q2: Intelligence** - DeepSeek-R1 Integration & Multi-language support.
- [ ] **Q3: Scale** - API v1 and Enterprise ATS connectors.
- [ ] **Q4: Platform** - White-labeling and Predictive Hiring Analytics.

---

## 📄 License
This project is licensed under the **PolyForm Noncommercial License 1.0.0**. See [LICENSE](LICENSE) for details.


---

<div align="center">
  <p>Built with ❤️ by the SmartHire Team</p>
  <p><i>"Defining the next era of autonomous recruitment."</i></p>
</div>
