# How to Check MongoDB Database Space

## Method 1: Using MongoDB Shell Commands

### If using Docker Compose:

1. **Connect to MongoDB:**
   ```bash
   docker exec -it mongodb mongosh -u admin -p StrongMongoPass123 --authenticationDatabase admin
   ```

2. **Switch to your database:**
   ```javascript
   use myapp
   ```

3. **Check database size (in bytes):**
   ```javascript
   db.stats()
   ```

4. **Get human-readable database size:**
   ```javascript
   db.stats(1024*1024)  // Size in MB
   ```

5. **Check specific collection size:**
   ```javascript
   db.users.stats()
   db.users.stats(1024*1024)  // Size in MB
   ```

6. **Get all collections and their sizes:**
   ```javascript
   db.getCollectionNames().forEach(function(collection) {
       var stats = db[collection].stats();
       print(collection + ": " + (stats.size / 1024 / 1024).toFixed(2) + " MB");
   })
   ```

### If using local MongoDB:

```bash
mongosh
# or
mongo
```

Then use the same commands as above.

---

## Method 2: Check Docker Volume Size

### Check MongoDB Docker volume size:

```bash
docker system df -v
```

This shows all Docker volumes and their sizes.

### Check specific volume:

```bash
docker volume inspect server_mongodb_data
```

### Get volume size in human-readable format:

**PowerShell:**
```powershell
docker volume inspect server_mongodb_data | ConvertFrom-Json | Select-Object -ExpandProperty Mountpoint | ForEach-Object { Get-ChildItem $_ -Recurse | Measure-Object -Property Length -Sum | Select-Object @{Name="Size(MB)";Expression={[math]::Round($_.Sum / 1MB, 2)}} }
```

**Linux/Mac:**
```bash
docker volume inspect server_mongodb_data --format '{{ .Mountpoint }}' | xargs du -sh
```

---

## Method 3: MongoDB Statistics Commands

### Detailed database statistics:
```javascript
db.stats()
```

**Output includes:**
- `dataSize`: Size of the data (in bytes)
- `storageSize`: Amount of storage allocated for document storage
- `indexSize`: Total size of all indexes
- `totalSize`: Total size of data + indexes

### Collection-level statistics:
```javascript
db.users.stats()
```

**Shows:**
- Collection size
- Number of documents
- Average document size
- Index sizes
- Storage size

### Get all databases and their sizes:
```javascript
db.adminCommand('listDatabases')
```

---

## Method 4: Quick Size Check Script

Save this as `check-db-size.js`:

```javascript
// Connect to MongoDB and check sizes
use myapp;

print("\n=== Database Statistics ===");
var dbStats = db.stats(1024*1024);
print("Database: " + db.getName());
print("Data Size: " + dbStats.dataSize.toFixed(2) + " MB");
print("Storage Size: " + dbStats.storageSize.toFixed(2) + " MB");
print("Index Size: " + dbStats.indexSize.toFixed(2) + " MB");
print("Total Size: " + dbStats.totalSize.toFixed(2) + " MB");
print("Collections: " + dbStats.collections);
print("Documents: " + dbStats.objects);

print("\n=== Collection Details ===");
db.getCollectionNames().forEach(function(collection) {
    var stats = db[collection].stats(1024*1024);
    print("\nCollection: " + collection);
    print("  Documents: " + stats.count);
    print("  Size: " + stats.size.toFixed(2) + " MB");
    print("  Storage: " + stats.storageSize.toFixed(2) + " MB");
    print("  Indexes: " + stats.nindexes + " (" + stats.totalIndexSize.toFixed(2) + " MB)");
});
```

**Run it:**
```bash
docker exec -i mongodb mongosh -u admin -p StrongMongoPass123 --authenticationDatabase admin < check-db-size.js
```

---

## Method 5: Using API Endpoint (Programmatic)

I've added an endpoint to check database stats via API:

**Endpoint:** `GET http://192.168.1.80:5000/api/db/stats`

This returns JSON with database statistics.

---

## Common MongoDB Size Queries

### Total database size:
```javascript
db.stats(1024*1024).dataSize + db.stats(1024*1024).indexSize
```

### Size of all collections:
```javascript
db.getCollectionNames().forEach(function(c) {
    print(c + ": " + (db[c].stats().size / 1024 / 1024).toFixed(2) + " MB");
});
```

### Number of documents per collection:
```javascript
db.getCollectionNames().forEach(function(c) {
    print(c + ": " + db[c].countDocuments() + " documents");
});
```

### Index sizes:
```javascript
db.users.getIndexes()
db.users.stats().indexSizes
```

---

## Understanding the Numbers

- **dataSize**: Actual size of your data
- **storageSize**: Space allocated for data (may be larger due to padding)
- **indexSize**: Size of all indexes
- **totalSize**: dataSize + indexSize
- **fileSize**: Total size of database files on disk

---

## Monitoring Disk Space

### Check system disk space (Windows):
```powershell
Get-PSDrive C | Select-Object Used,Free
```

### Check Docker disk usage:
```bash
docker system df
```

### Clean up unused Docker resources:
```bash
docker system prune -a --volumes
```
⚠️ **Warning:** This removes unused containers, networks, images, and volumes!

---

## Troubleshooting

### If database seems too large:
1. Check for duplicate data
2. Review indexes - too many indexes increase size
3. Check for large documents
4. Consider data archiving for old records

### If you need to free space:
1. Remove unused collections
2. Delete old documents
3. Compact collections (requires downtime)
4. Rebuild indexes if needed

