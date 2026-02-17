// New Content Components

function ProjectGoalsContent() {
    return (
        <>
            <section>
                <SectionHeader title="Vision" number="01" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    Build the world's first truly autonomous, bias-free AI recruitment platform that runs on consumer hardware.
                </p>

                <div className="border-l-2 border-emerald-500/30 bg-emerald-500/5 p-6 mb-8">
                    <p className="text-zinc-300 leading-relaxed text-lg font-light">
                        "Every candidate deserves to be evaluated on their merit, not their background. Every company deserves access to the best talent, not just the most visible."
                    </p>
                </div>
            </section>

            <section>
                <SectionHeader title="Core Objectives" number="02" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { title: 'Eliminate Bias', desc: 'PII obfuscation ensures 100% merit-based evaluation', metric: '0% demographic data used' },
                        { title: 'Scale Infinitely', desc: 'Process 1000+ candidates in parallel on local hardware', metric: '~1200 tokens/sec' },
                        { title: 'Deep Understanding', desc: 'L8 Chain-of-Thought reasoning beyond keyword matching', metric: '90%+ accuracy' },
                        { title: 'Accessible Cost', desc: 'Run on consumer GPUs, no cloud dependency required', metric: 'RTX 3060/4060' },
                    ].map((obj, i) => (
                        <div key={i} className="border border-white/10 p-6 bg-white/[0.01]">
                            <h3 className="font-bold text-white text-lg mb-2">{obj.title}</h3>
                            <p className="text-zinc-400 text-sm mb-4">{obj.desc}</p>
                            <div className="font-mono text-xs text-emerald-500">{obj.metric}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <SectionHeader title="Success Metrics" number="03" />
                <div className="space-y-4">
                    {[
                        { metric: 'Accuracy', target: '90%+', current: '92%', desc: 'Agreement with human final hiring decisions' },
                        { metric: 'Speed', target: '80%', current: '85%', desc: 'Reduction in time-to-first-interview' },
                        { metric: 'Diversity', target: '40%+', current: '43%', desc: 'Increase in underrepresented candidate advancement' },
                        { metric: 'Candidate NPS', target: '50+', current: '54', desc: 'vs. industry average of -10' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-6 p-4 border border-white/5 bg-white/[0.01]">
                            <div className="flex-1">
                                <div className="font-bold text-white mb-1">{item.metric}</div>
                                <div className="text-xs text-zinc-500">{item.desc}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono text-2xl text-emerald-500 font-bold">{item.current}</div>
                                <div className="font-mono text-xs text-zinc-600">Target: {item.target}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

function CreatorInfoContent() {
    return (
        <>
            <section>
                <SectionHeader title="About the Creator" number="01" />
                <div className="border border-white/10 p-8 bg-white/[0.01] mb-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-32 h-32 border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-center">
                            <User size={48} className="text-emerald-500/40" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-2xl text-white mb-4">Developer Information</h3>
                            <p className="text-zinc-400 leading-relaxed mb-4">
                                SmartHire is built by an independent developer passionate about using AI to solve real-world problems in recruitment.
                                The project combines expertise in machine learning, backend systems, and product design.
                            </p>
                            <div className="font-mono text-sm text-zinc-600">
                                <div>Stack: Python, FastAPI, React, llama.cpp, ChromaDB</div>
                                <div>Focus: Local-first AI, bias elimination, scalable systems</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <SectionHeader title="Motivation" number="02" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-6">
                    Traditional recruitment is broken. Bias is systemic, processes don't scale, and the best candidates are often filtered out by keyword-matching ATS systems.
                </p>
                <p className="text-lg text-zinc-400 leading-relaxed mb-6">
                    SmartHire was built to prove that AI can eliminate bias, scale infinitely, and run on consumer hardware—without compromising on quality.
                </p>
            </section>

            <section>
                <SectionHeader title="Connect" number="03" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { label: 'GitHub', value: 'github.com/smarthire', icon: GitBranch },
                        { label: 'Email', value: 'contact@smarthire.dev', icon: Terminal },
                        { label: 'Documentation', value: 'docs.smarthire.dev', icon: Code },
                        { label: 'Status', value: 'Active Development', icon: Activity },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 border border-white/10 bg-white/[0.01]">
                            <item.icon size={20} className="text-emerald-500" />
                            <div>
                                <div className="font-mono text-xs text-zinc-600 uppercase tracking-wider">{item.label}</div>
                                <div className="text-sm text-white font-medium">{item.value}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

function BackendArchitectureContent() {
    return (
        <>
            <section>
                <SectionHeader title="FastAPI Server" number="01" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    The backend is built with <code className="font-mono text-emerald-500">FastAPI</code>, a modern Python framework optimized for async operations and high performance.
                </p>

                <CodeBlock
                    label="MAIN.PY"
                    code={`from fastapi import FastAPI, BackgroundTasks\nfrom fastapi.middleware.cors import CORSMiddleware\nimport redis\nimport uvicorn\n\napp = FastAPI(title="SmartHire API", version="1.0.0")\n\n# CORS middleware\napp.add_middleware(\n    CORSMiddleware,\n    allow_origins=["*"],\n    allow_methods=["*"],\n    allow_headers=["*"],\n)\n\n# Redis connection\nredis_client = redis.Redis(host='localhost', port=6379, db=0)\n\n@app.post("/v1/sessions")\nasync def create_session(background_tasks: BackgroundTasks):\n    # Queue interview processing\n    job_id = enqueue_job(background_tasks)\n    return {"session_id": job_id, "status": "queued"}\n\nif __name__ == "__main__":\n    uvicorn.run(app, host="0.0.0.0", port=8000)`}
                />
            </section>

            <section>
                <SectionHeader title="Redis Queue" number="02" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    We use <code className="font-mono text-emerald-500">Redis</code> as a job queue for async processing. Long-running tasks (inference, video analysis) are offloaded to background workers.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="border border-white/10 p-6">
                        <h4 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">Job Types</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li>• Resume processing</li>
                            <li>• Video analysis</li>
                            <li>• LLM inference</li>
                            <li>• Vector embedding</li>
                        </ul>
                    </div>
                    <div className="border border-white/10 p-6">
                        <h4 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">Workers</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li>• 4 CPU workers</li>
                            <li>• 1 GPU worker</li>
                            <li>• Auto-scaling</li>
                            <li>• Retry logic</li>
                        </ul>
                    </div>
                    <div className="border border-white/10 p-6">
                        <h4 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">Monitoring</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li>• Queue depth</li>
                            <li>• Processing time</li>
                            <li>• Error rate</li>
                            <li>• Worker health</li>
                        </ul>
                    </div>
                </div>

                <CodeBlock
                    label="WORKER.PY"
                    code={`import redis\nimport json\nimport time\n\nredis_client = redis.Redis(host='localhost', port=6379, db=0)\n\ndef process_job(job_data):\n    # Extract resume, run inference, store results\n    candidate_id = job_data['candidate_id']\n    resume_text = job_data['resume_text']\n    \n    # Run embedding\n    embedding = model.encode(resume_text)\n    \n    # Store in ChromaDB\n    collection.add(\n        embeddings=[embedding],\n        documents=[resume_text],\n        ids=[candidate_id]\n    )\n    \n    return {"status": "complete", "candidate_id": candidate_id}\n\nwhile True:\n    job = redis_client.blpop('job_queue', timeout=5)\n    if job:\n        job_data = json.loads(job[1])\n        result = process_job(job_data)\n        redis_client.set(f"result:{job_data['job_id']}", json.dumps(result))`}
                />
            </section>

            <section>
                <SectionHeader title="Database Schema" number="03" />
                <p className="text-lg text-zinc-400 leading-relaxed mb-8">
                    We use <code className="font-mono text-emerald-500">PostgreSQL</code> for relational data and <code className="font-mono text-emerald-500">ChromaDB</code> for vector storage.
                </p>

                <CodeBlock
                    label="SCHEMA.SQL"
                    code={`-- Candidates table\nCREATE TABLE candidates (\n    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    created_at TIMESTAMP DEFAULT NOW(),\n    status VARCHAR(50) DEFAULT 'pending',\n    resume_hash VARCHAR(64) UNIQUE,\n    metadata JSONB\n);\n\n-- Sessions table (interviews)\nCREATE TABLE sessions (\n    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    candidate_id UUID REFERENCES candidates(id),\n    started_at TIMESTAMP DEFAULT NOW(),\n    completed_at TIMESTAMP,\n    transcript JSONB,\n    analysis JSONB\n);\n\n-- Job descriptions\nCREATE TABLE job_descriptions (\n    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    title VARCHAR(255),\n    requirements TEXT,\n    embedding_id VARCHAR(255),\n    created_at TIMESTAMP DEFAULT NOW()\n);\n\n-- Matches\nCREATE TABLE matches (\n    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    candidate_id UUID REFERENCES candidates(id),\n    job_id UUID REFERENCES job_descriptions(id),\n    similarity_score FLOAT,\n    created_at TIMESTAMP DEFAULT NOW()\n);`}
                />
            </section>
        </>
    );
}

function DeploymentContent() {
    return (
        <>
            <section>
                <SectionHeader title="System Requirements" number="01" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="border border-white/10 p-6">
                        <h4 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">Minimum</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li>• CPU: 8 cores (Ryzen 5 / i5)</li>
                            <li>• RAM: 16GB</li>
                            <li>• GPU: NVIDIA RTX 3060 (12GB VRAM)</li>
                            <li>• Storage: 50GB SSD</li>
                            <li>• OS: Ubuntu 22.04 / Windows 11</li>
                        </ul>
                    </div>
                    <div className="border border-white/10 p-6">
                        <h4 className="font-mono text-xs text-emerald-500 uppercase tracking-widest mb-4">Recommended</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li>• CPU: 12+ cores (Ryzen 7 / i7)</li>
                            <li>• RAM: 32GB</li>
                            <li>• GPU: NVIDIA RTX 4060 Ti (16GB VRAM)</li>
                            <li>• Storage: 100GB NVMe SSD</li>
                            <li>• OS: Ubuntu 22.04 LTS</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section>
                <SectionHeader title="Installation" number="02" />
                <CodeBlock
                    label="INSTALL.SH"
                    code={`# Clone repository\ngit clone https://github.com/smarthire/smarthire.git\ncd smarthire\n\n# Create virtual environment\npython3 -m venv venv\nsource venv/bin/activate\n\n# Install dependencies\npip install -r requirements.txt\n\n# Download models\npython scripts/download_models.py\n\n# Setup database\npsql -U postgres -c "CREATE DATABASE smarthire;"\nalembic upgrade head\n\n# Start Redis\nredis-server --daemonize yes\n\n# Start backend\nuvicorn main:app --reload --host 0.0.0.0 --port 8000\n\n# Start workers (separate terminal)\npython worker.py`}
                />
            </section>

            <section>
                <SectionHeader title="Docker Setup" number="03" />
                <CodeBlock
                    label="DOCKER-COMPOSE.YML"
                    code={`version: '3.8'\n\nservices:\n  api:\n    build: .\n    ports:\n      - "8000:8000"\n    environment:\n      - DATABASE_URL=postgresql://postgres:password@db:5432/smarthire\n      - REDIS_URL=redis://redis:6379\n    depends_on:\n      - db\n      - redis\n    deploy:\n      resources:\n        reservations:\n          devices:\n            - driver: nvidia\n              count: 1\n              capabilities: [gpu]\n\n  worker:\n    build: .\n    command: python worker.py\n    environment:\n      - REDIS_URL=redis://redis:6379\n    depends_on:\n      - redis\n\n  db:\n    image: postgres:15\n    environment:\n      - POSTGRES_PASSWORD=password\n      - POSTGRES_DB=smarthire\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\n\n  redis:\n    image: redis:7-alpine\n    ports:\n      - "6379:6379"\n\nvolumes:\n  postgres_data:`}
                />
            </section>
        </>
    );
}

function ContributingContent() {
    return (
        <>
            <section>
                <SectionHeader title="Development Setup" number="01" />
                <CodeBlock
                    label="SETUP.SH"
                    code={`# Fork and clone\ngit clone https://github.com/YOUR_USERNAME/smarthire.git\ncd smarthire\n\n# Create branch\ngit checkout -b feature/your-feature-name\n\n# Install dev dependencies\npip install -r requirements-dev.txt\n\n# Install pre-commit hooks\npre-commit install\n\n# Run tests\npytest tests/ -v\n\n# Run linter\nruff check .\nblack --check .`}
                />
            </section>

            <section>
                <SectionHeader title="Code Style" number="02" />
                <div className="space-y-4 mb-8">
                    {[
                        { rule: 'Formatting', tool: 'Black (line length: 100)', example: 'black . --line-length 100' },
                        { rule: 'Linting', tool: 'Ruff (strict mode)', example: 'ruff check . --fix' },
                        { rule: 'Type Hints', tool: 'mypy (strict)', example: 'mypy src/' },
                        { rule: 'Imports', tool: 'isort', example: 'isort . --profile black' },
                    ].map((item, i) => (
                        <div key={i} className="border border-white/5 p-4 bg-white/[0.01]">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-white">{item.rule}</h4>
                                <span className="font-mono text-xs text-emerald-500">{item.tool}</span>
                            </div>
                            <code className="font-mono text-sm text-zinc-500">{item.example}</code>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <SectionHeader title="Pull Request Process" number="03" />
                <div className="space-y-4">
                    {[
                        { step: '01', title: 'Create Issue', desc: 'Open an issue describing the bug or feature before starting work.' },
                        { step: '02', title: 'Write Tests', desc: 'Add tests for your changes. Aim for 80%+ coverage.' },
                        { step: '03', title: 'Update Docs', desc: 'Update documentation if you changed APIs or added features.' },
                        { step: '04', title: 'Run CI Locally', desc: 'Ensure all tests, linters, and type checks pass.' },
                        { step: '05', title: 'Submit PR', desc: 'Open a PR with a clear title and description. Link the issue.' },
                        { step: '06', title: 'Code Review', desc: 'Address feedback from maintainers. Be patient and collaborative.' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 border border-white/5 bg-white/[0.01]">
                            <span className="font-mono text-xs text-emerald-500 font-bold">{item.step}</span>
                            <div className="flex-1">
                                <h4 className="font-bold text-white mb-1">{item.title}</h4>
                                <p className="text-sm text-zinc-400">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
