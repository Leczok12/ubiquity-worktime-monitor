# /api/admin/device

## GET /all

### Permissions

SYSTEM_ADMIN

### Description

Get all door device

### URL Params

|    Name    | Required |  Type  |
| :--------: | :------: | :----: |
|  pageSize  |    F     | number |
| pageNumber |    F     | number |

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
    pagination: {
        page: number;
        total: number;
        pageSize: number;
    } | undefined
}
```

## PUT /:deviceId

### Permissions

SYSTEM_ADMIN

### Description

based on `:deviceId` set device types

### Request type

```ts
{
    type: 'WORK_START_STOP' | 'BREAK_START' | 'BREAK_STOP' | 'UNUSED';
}
```

### Response type

```ts
{
    status: string;
    errorMessage: string | undefined;
}
```
