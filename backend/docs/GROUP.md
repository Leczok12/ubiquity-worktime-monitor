# /api/group

## [GET] /api/group/all

### Description

Returns list of all groups.

### Params

| Name | Required | Type |
| :--: | :------: | :--: |

### Data type

```js
{
    id: string;
    name: string;
}
[];
```

## GET /api/group/[groupId]/all

Returns list of all workers in group

### Params

|    Name    | Required |      Type       |
| :--------: | :------: | :-------------: |
| pageNumber |    F     | Integer above 0 |
|  pageSize  |    F     | Integer above 0 |

### Return type

```js
{
}
```
