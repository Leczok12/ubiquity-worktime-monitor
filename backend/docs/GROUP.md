# /api/group

## GET /all

### Permissions

VIEWER

### Description

Get all groups where `sync` is true

### Response type

```ts
{
    status: string;
    errorMessage: string | undefined;
    data: {
        id: string;
        name: string;
    }
    [] | undefined;
}
```
