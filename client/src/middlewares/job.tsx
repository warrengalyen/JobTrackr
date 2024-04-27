import axios from 'axios';

export const fetchJob = async (link: any, token: any) =>
    await axios.post(`${process.env.REACT_APP_URL}/fetch-job`, link, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

export const getJobs = async (userId: any, query: any, token: any) =>
    await axios.post(`${process.env.REACT_APP_URL}/jobs/${userId}`, query, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

export const addJob = async (userId: any, jobDetails: any, token: any) =>
    await axios.post(
        `${process.env.REACT_APP_URL}/add-job/${userId}`,
        jobDetails,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
    );

export const changeJobStatus = async (jobId: any, userId: any, token: any) =>
    await axios.post(`${process.env.REACT_APP_URL}/status/${jobId}`, userId, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
