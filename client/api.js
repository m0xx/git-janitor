const fetch = global.window.fetch;

const api = {
    checkStatus: response => {
        if (response.ok) {
            return response;
        } else {
            let error = new Error(response.statusText);
            error.response = response;
            throw error;
        }
    },
    get: path => {
        return fetch(path, {
            method: 'GET',
        })
            .then(api.checkStatus)
            .then(response => {
                return response.json();
            });
    },
    post: (path, data) => {
        return fetch(path, {
            method: 'POST',
            body: JSON.stringify(data),
        })
            .then(api.checkStatus)
            .then(response => {
                return response.json();
            });
    },
};

export function fetchBranches() {
    return api.get('/api/branches')
}

export function fetchCurrentBranch() {
    return api.get('/api/branches/current')
}

export function compareBranches(branchA, branchB) {
    return api.post('/api/branches/compare', {branchA, branchB})
}

