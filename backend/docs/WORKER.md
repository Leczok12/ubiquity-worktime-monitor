# /api/worker

## GET /all

### Permissions

VIEWER

### Description

Get all workers

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
        lastname: string;
        email: string | undefined;
        active: boolean;
    }
    [] | undefined;
    pagination: {
        page: number;
        total: number;
        pageSize: number;
    } | undefined
}
```

## GET /group/:groupId/all

### Permissions

VIEWER

### Description

Get all workers in group

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
        lastname: string;
        email: string | undefined;
        active: boolean;
    }
    [] | undefined;
    pagination: {
        page: number;
        total: number;
        pageSize: number;
    } | undefined
}
```

## GET /find

### Permissions

VIEWER

### Description

Find workes based on `keyword`

### URL Params

|    Name    | Required |  Type  |
| :--------: | :------: | :----: |
|  keyword   |    T     | string |
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
        lastname: string;
        email: string | undefined;
        active: boolean;
    }
    [] | undefined;
    pagination: {
        page: number;
        total: number;
        pageSize: number;
    } | undefined
}
```

## GET /me

### Permissions

WORKER

### Description

based on logged user id get worker details

### Response type

```ts
{
    status: string;
    errorMessage: string | undefined;
    data: {
        id: string;
        name: string;
        lastname: string;
        email: string | undefined;
        active: boolean;
    } | undefined;
}
```

## GET /:workerId

### Permissions

VIEWER

### Description

based on `workerId` get worker details

### Response type

```ts
{
    status: string;
    errorMessage: string | undefined;
    data: {
        id: string;
        name: string;
        lastname: string;
        email: string | undefined;
        active: boolean;
    } | undefined;
}
```
