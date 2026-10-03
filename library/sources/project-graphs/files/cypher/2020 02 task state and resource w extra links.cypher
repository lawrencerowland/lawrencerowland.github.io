CREATE CONSTRAINT ON (node:`UNIQUE IMPORT LABEL`) ASSERT (node.`UNIQUE IMPORT ID`) IS UNIQUE;
UNWIND [{_id:46, properties:{name:"Identify waste"}}, {_id:47, properties:{name:"Remove waste"}}, {_id:48, properties:{name:"Prepare Waste extraction plan"}}, {_id:49, properties:{name:"Commission suppliers"}}] AS row
CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Task;
UNWIND [{_id:110, properties:{name:"No waste left on site"}}, {_id:111, properties:{name:"Waste understood"}}, {_id:112, properties:{name:"Plan agreed"}}, {_id:113, properties:{name:"Suppliers ready"}}] AS row
CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:State;
UNWIND [{_id:114, properties:{role:"Engineer"}}, {_id:115, properties:{role:"Project_manager"}}, {_id:116, properties:{role:"Supplier"}}, {_id:117, properties:{role:"Operator"}}] AS row
CREATE (n:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row._id}) SET n += row.properties SET n:Resource;
UNWIND [{start: {_id:115}, end: {_id:49}, properties:{}}, {start: {_id:116}, end: {_id:49}, properties:{}}, {start: {_id:114}, end: {_id:48}, properties:{}}, {start: {_id:116}, end: {_id:47}, properties:{}}, {start: {_id:117}, end: {_id:46}, properties:{}}] AS row
MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})
MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})
CREATE (start)-[r:allocated_to]->(end) SET r += row.properties;
UNWIND [{start: {_id:112}, end: {_id:49}, properties:{}}, {start: {_id:111}, end: {_id:48}, properties:{}}, {start: {_id:113}, end: {_id:47}, properties:{}}] AS row
MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})
MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})
CREATE (start)-[r:permits]->(end) SET r += row.properties;
UNWIND [{start: {_id:47}, end: {_id:110}, properties:{}}, {start: {_id:48}, end: {_id:112}, properties:{}}, {start: {_id:49}, end: {_id:113}, properties:{}}, {start: {_id:46}, end: {_id:111}, properties:{}}] AS row
MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})
MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})
CREATE (start)-[r:causes]->(end) SET r += row.properties;
UNWIND [{start: {_id:46}, end: {_id:48}, properties:{}}, {start: {_id:48}, end: {_id:49}, properties:{}}, {start: {_id:49}, end: {_id:47}, properties:{}}] AS row
MATCH (start:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.start._id})
MATCH (end:`UNIQUE IMPORT LABEL`{`UNIQUE IMPORT ID`: row.end._id})
CREATE (start)-[r:permits]->(end) SET r += row.properties;
MATCH (n:`UNIQUE IMPORT LABEL`)  WITH n LIMIT 20000 REMOVE n:`UNIQUE IMPORT LABEL` REMOVE n.`UNIQUE IMPORT ID`;
DROP CONSTRAINT ON (node:`UNIQUE IMPORT LABEL`) ASSERT (node.`UNIQUE IMPORT ID`) IS UNIQUE;
