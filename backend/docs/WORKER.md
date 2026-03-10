# /api/worker

## /all

Returns list of all workers.

### Params

|    Name    | Required |      Type       |
| :--------: | :------: | :-------------: |
| pageNumber |    F     | Integer above 0 |
|  pageSize  |    F     | Integer above 0 |

## /find

Returns list of workers matching keyword.

### Params

|    Name    | Required |      Type       |
| :--------: | :------: | :-------------: |
|  keyword   |    T     |     String      |
| pageNumber |    F     | Integer above 0 |
|  pageSize  |    F     | Integer above 0 |

## /group/[groupId]/all

Returns list of all workers in group

### Params

|    Name    | Required |      Type       |
| :--------: | :------: | :-------------: |
| pageNumber |    F     | Integer above 0 |
|  pageSize  |    F     | Integer above 0 |
