const API_URL = '/api';

// Utility functions
const getToken = () => localStorage.getItem('token');
const getUser = () => JSON.parse(localStorage.getItem('user'));
const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
};

// Setup Navigation UI Based on Auth State
const setupNav = () => {
    const user = getUser();
    if (user) {
        document.getElementById('nav-login').style.display = 'none';
        document.getElementById('nav-register').style.display = 'none';
        document.getElementById('nav-dashboard').style.display = 'inline-block';
        document.getElementById('nav-logout').style.display = 'inline-block';
        
        // Redirect dashboard link based on role
        if(user.role === 'admin') {
            document.getElementById('nav-dashboard').href = 'admin.html';
        }

        document.getElementById('nav-logout').addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
};

// Form data handling for Login/Register
const handleAuth = async (url, data) => {
    try {
        const res = await fetch(`${API_URL}${url}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (res.ok) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            alert('Success!');
            window.location.href = result.user.role === 'admin' ? 'admin.html' : 'dashboard.html';
        } else {
            alert(result.message);
        }
    } catch (err) {
        alert('Server error');
        console.error(err);
    }
};

// Fetch Jobs
const fetchJobs = async () => {
    try {
        const res = await fetch(`${API_URL}/jobs`);
        const jobs = await res.json();
        const jobList = document.getElementById('job-list');
        if (!jobList) return;

        jobList.innerHTML = '';
        if (jobs.length === 0) {
            jobList.innerHTML = '<p>No jobs found.</p>';
            return;
        }

        jobs.forEach(job => {
            jobList.innerHTML += `
                <div class="job-card">
                    <div class="job-type">${job.type}</div>
                    <div style="flex-grow:1; margin-top:20px;">
                        <h3 class="job-title">${job.title}</h3>
                        <div class="job-company">${job.company}</div>
                        <div class="job-details">
                            <span>📍 ${job.location}</span>
                            <span>💵 ${job.salary}</span>
                        </div>
                    </div>
                    <button class="btn btn-outline" onclick="applyJob('${job._id}')" style="width:100%; margin-top:15px;">Apply Now</button>
                </div>
            `;
        });
    } catch (err) {
        console.error('Error fetching jobs:', err);
    }
};

const applyJob = (jobId) => {
    if (!getUser()) {
        alert('Please login to apply');
        window.location.href = 'login.html';
        return;
    }
    // Simplistic handling for demo. Ideally this opens a modal.
    localStorage.setItem('applyJobId', jobId);
    window.location.href = 'dashboard.html#apply';
};

document.addEventListener('DOMContentLoaded', setupNav);
