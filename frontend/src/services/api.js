// API Client for SmartHire Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class APIClient {
    constructor(baseURL = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'API request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Candidates
    async getCandidates(skip = 0, limit = 100) {
        return this.request(`/candidates/?skip=${skip}&limit=${limit}`);
    }

    async getCandidate(id) {
        return this.request(`/candidates/${id}`);
    }

    async createCandidate(data) {
        return this.request('/candidates/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async deleteCandidate(id) {
        return this.request(`/candidates/${id}`, {
            method: 'DELETE',
        });
    }

    async parseResume(candidateId, file) {
        const formData = new FormData();
        formData.append('file', file);

        return this.request(`/candidates/${candidateId}/parse-resume`, {
            method: 'POST',
            headers: {}, // Let browser set Content-Type for FormData
            body: formData,
        });
    }

    // Jobs
    async getJobs(activeOnly = true) {
        return this.request(`/jobs/?active_only=${activeOnly}`);
    }

    async getJob(id) {
        return this.request(`/jobs/${id}`);
    }

    async createJob(data) {
        return this.request('/jobs/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateJob(id, data) {
        return this.request(`/jobs/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteJob(id) {
        return this.request(`/jobs/${id}`, {
            method: 'DELETE',
        });
    }

    async getJobApplications(jobId) {
        return this.request(`/jobs/${jobId}/applications`);
    }

    // Applications
    async getApplications(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/applications/?${params}`);
    }

    async getApplication(id) {
        return this.request(`/applications/${id}`);
    }

    async createApplication(data) {
        return this.request('/applications/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateApplication(id, data) {
        return this.request(`/applications/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async recalculateMatchScore(id) {
        return this.request(`/applications/${id}/recalculate-score`, {
            method: 'POST',
        });
    }

    // Interviews
    async getInterview(id) {
        return this.request(`/interviews/${id}`);
    }

    async createInterview(data) {
        return this.request('/interviews/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async startInterview(id) {
        return this.request(`/interviews/${id}/start`, {
            method: 'POST',
        });
    }

    async analyzeFrame(id, frameData) {
        return this.request(`/interviews/${id}/analyze-frame`, {
            method: 'POST',
            body: JSON.stringify({ frame_data: frameData }),
        });
    }

    async transcribeAudio(id, audioFile) {
        const formData = new FormData();
        formData.append('audio_file', audioFile);

        return this.request(`/interviews/${id}/transcribe-audio`, {
            method: 'POST',
            headers: {},
            body: formData,
        });
    }

    async completeInterview(id) {
        return this.request(`/interviews/${id}/complete`, {
            method: 'POST',
        });
    }

    async getInterviewAnalysis(id) {
        return this.request(`/interviews/${id}/analysis`);
    }

    // Auth
    async login(username, password) {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        return this.request('/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        });
    }

    // Health Check
    async healthCheck() {
        return this.request('/health');
    }
}

// Export singleton instance
const apiClient = new APIClient();
export default apiClient;
