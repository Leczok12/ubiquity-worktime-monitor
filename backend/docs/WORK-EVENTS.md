# /api/work-events

## GET /me

### Permissions

WORKER

### Description

based on logged user id get work events with worked secods from `since` to `until` timestamp.

### URL Params

| Name  | Required |  Type  |
| :---: | :------: | :----: |
| Since |    T     | number |
| Until |    T     | number |

### Response type

```ts
{
    status: string;
    errorMessage: string | undefined;
    data: {
        seconds: number;
        dayStart: string; // ISO string
        dayEnd: string; // ISO string
        events: {
            id: string;
            timeStart: string; // ISO string
            placeStart: string | undefined;
            timeEnd: string; // ISO string
            placeEnd: string | undefined;
            type: 'WORK' | 'BREAK';
        }
        [];
    }
    [] | undefined;
}
```

## GET /:workerId

### Permissions

VIEWER

### Description

based on `:workerId` get work events with worked secods from `since` to `until` timestamp.

### URL Params

| Name  | Required |  Type  |
| :---: | :------: | :----: |
| Since |    T     | number |
| Until |    T     | number |

### Response type

```ts
{
    status: string;
    errorMessage: string | undefined;
    data: {
        seconds: number;
        dayStart: string; // ISO string
        dayEnd: string; // ISO string
        events: {
            id: string;
            timeStart: string; // ISO string
            placeStart: string | undefined;
            timeEnd: string; // ISO string
            placeEnd: string | undefined;
            type: 'WORK' | 'BREAK';
        }
        [];
    }
    [] | undefined;
}
```

## POST /worker/:workerId

### Permissions

MANAGER

### Description

based on `:workerId` is creating work event.

`timeStart` and `timeEnd` must be in the same work day.

`timeStart` must be earlier than `timeEnd`.

### Request type

```ts
{
    timeStart: string; // ISO string
    placeStart: string | undefined;
    timeEnd: string; // ISO string
    placeEnd: string | undefined;
    type: 'WORK' | 'BREAK';
}
```

### Response type

```ts
{
    status: string;
    errorMessage: string | undefined;
}
```

## PUT /:workEventId

### Permissions

MANAGER

### Description

based on `:workEventId` is setting `timeStart`, `placeStart`, `timeEnd`, `placeEnd`, `type` and updateing `lastModifiedByUserId` and `lastModified`.

`timeStart` and `timeEnd` must be in the same work day. You can't by updateing move one event to another work day.

`timeStart` must be earlier than `timeEnd`.

### Request type

```ts
{
    timeStart: string; // ISO string
    placeStart: string | undefined;
    timeEnd: string; // ISO string
    placeEnd: string | undefined;
    type: 'WORK' | 'BREAK';
}
```

### Response type

```ts
{
    status: string;
    errorMessage: string | undefined;
}
```

## DELETE /:workEventId

### Permissions

MANAGER

### Description

based on `:workEventId` is setting `isDeleted` to true and updateing `lastModifiedByUserId` and `lastModified`.

### Response type

```ts
{
    status: string;
    errorMessage: string | undefined;
}
```
