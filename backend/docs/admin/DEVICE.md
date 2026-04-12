# /api/admin/device

## GET /all

### Permissions

SYSTEM_ADMIN

### Description

Get all door device

### Response type

```ts
{
    status: string;
    errorMessage: string | undefined;
    data: {
        id: string;
        name: string;
        type: 'WORK_START_STOP' | 'BREAK_START' | 'BREAK_STOP' | 'UNUSED';
    }
    [] | undefined;
}
```

## PUT /

### Permissions

SYSTEM_ADMIN

### Description

set device types

### Request type

```ts
{
    data: {
        id: string;
        type: 'WORK_START_STOP' | 'BREAK_START' | 'BREAK_STOP' | 'UNUSED';
    }
    [];
}
```

### Response type

```ts
{
    status: string;
    errorMessage: string | undefined;
}
```
