import http from 'k6/http';
import { check, group, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '1m', target: 50 },
        { duration: '3m', target: 200 },
        { duration: '2m', target: 100 },
        { duration: '1m', target: 0 },
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<500'],
    },
};

export default function () {
    let url = 'http://api.ulgen.app:8000/api/v1/route';
    let payload = JSON.stringify({
        epsilon: 0.002,
        vehicle_count: 4,
        depot: { latitude: 41.015137, longitude: 28.979530 },
        location: [
            { latitude: 39.925533, longitude: 32.866287 },
            { latitude: 38.423733, longitude: 27.142826 },
            { latitude: 37.000000, longitude: 35.321335 },
            { latitude: 37.575275, longitude: 36.922821 },
            { latitude: 37.066666, longitude: 37.383331 },
            { latitude: 36.891339, longitude: 30.712438 },
            { latitude: 39.658478, longitude: 27.876850 },
        ],
    });

    let params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    group('API Test', function () {
        let res = http.post(url, payload, params);
        check(res, {
            'status is 200': (r) => r.status === 200,
            'response body is not empty': (r) => r.body && r.body.length > 0,
        });
    });

    sleep(1);
}
