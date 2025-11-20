# API Service Usage Examples

## Import the service

```typescript
import { apiService } from '../services/api';
```

## GET Request

```typescript
// Simple GET
const users = await apiService.get('/users');

// GET with query parameters
const user = await apiService.get('/users/123');

// GET with config
const data = await apiService.get('/users', {
  params: { page: 1, limit: 10 },
  headers: { 'Custom-Header': 'value' }
});
```

## POST Request

```typescript
// Create new user
const newUser = await apiService.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// Login example
const response = await apiService.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});
```

## PUT Request

```typescript
// Update entire resource
const updatedUser = await apiService.put('/users/123', {
  name: 'Jane Doe',
  email: 'jane@example.com',
  status: 'active'
});
```

## PATCH Request

```typescript
// Partial update
const result = await apiService.patch('/users/123', {
  status: 'inactive'
});
```

## DELETE Request

```typescript
// Delete resource
await apiService.delete('/users/123');

// Delete with config
await apiService.delete('/users/123', {
  params: { force: true }
});
```

## Upload File

```typescript
// Single file upload
const handleFileUpload = async (file: File) => {
  const result = await apiService.upload(
    '/upload',
    file,
    (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log(`Upload Progress: ${percentCompleted}%`);
    }
  );
  console.log('Upload successful:', result);
};

// Multiple files upload
const handleMultipleFiles = async (files: File[]) => {
  const result = await apiService.upload('/upload/multiple', files);
  console.log('Files uploaded:', result);
};

// Custom FormData
const handleCustomUpload = async () => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('description', 'My document');
  formData.append('category', 'reports');
  
  const result = await apiService.upload('/documents', formData);
};
```

## Download File

```typescript
// Download with auto filename from response
await apiService.download('/files/report.pdf');

// Download with custom filename
await apiService.download('/files/123', 'my-report.pdf');

// Download with config
await apiService.download('/files/export', 'data.csv', {
  params: { format: 'csv', date: '2025-01-01' }
});
```

## Advanced Usage

```typescript
// Custom request with full config
const data = await apiService.request({
  method: 'POST',
  url: '/custom-endpoint',
  data: { key: 'value' },
  headers: { 'X-Custom-Header': 'value' },
  timeout: 5000
});
```

## Error Handling

```typescript
try {
  const data = await apiService.get('/users');
  console.log(data);
} catch (error: any) {
  if (error.response) {
    // Server responded with error
    console.error('Error:', error.response.status);
    console.error('Message:', error.response.data);
  } else if (error.request) {
    // No response received
    console.error('No response from server');
  } else {
    // Request setup error
    console.error('Error:', error.message);
  }
}
```

## React Component Example

```typescript
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiService.get<User[]>('/users');
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiService.delete(`/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (err: any) {
      alert('Failed to delete user');
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {users.map(user => (
        <div key={user.id}>
          <span>{user.name}</span>
          <button onClick={() => handleDelete(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};
```

## Configuration

Set your API base URL in `.env` file:

```
VITE_API_BASE_URL=https://api.example.com/api
```

Default: `http://localhost:3000/api`
