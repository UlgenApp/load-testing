import http from 'k6/http';
import { check, group, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '1m', target: 10 },
        { duration: '3m', target: 100 },
        { duration: '2m', target: 50 },
        { duration: '1m', target: 0 },
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<500'],
    },
};

export default function () {
    let url = 'http://api.ulgen.app:8090/api/v1/producer/produce';
    let payload = JSON.stringify({
        userId: 1,
        location: { latitude: 41.015137, longitude: 28.979530 },
        activeUser: 2,
        userCity: "Istanbul",
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
