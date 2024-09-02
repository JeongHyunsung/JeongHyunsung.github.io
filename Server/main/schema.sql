CREATE TABLE "posts" (
  "pid" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "title" varchar,
  "content" text,
  "upload_date" timestamp,
  "image_location" text,
  "is_blog" bytea
);

CREATE TABLE "tags" (
  "tid" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "tag_name" text
);

CREATE TABLE "comments" (
   "cid" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   "uid" integer NOT NULL,
   "pid" integer NOT NULL,
   "parent_cid" integer DEFAULT NULL,
   "content" text NOT NULL,
   "created_at" timestamp,
   
   FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE 
   FOREIGN KEY (pid) REFERENCES posts(pid) ON DELETE CASCADE 
   FOREIGN KEY (parent_cid) REFERENCES comments(cid)
);

comments_parent_cid_fkey

CREATE TABLE "users" (
  "uid" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "is_admin" boolean DEFAULT FALSE,
  "sub" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "email" text NOT NULL UNIQUE,
  "pic" text NOT NULL
);

CREATE TABLE "post_tag" (
  "tid" integer,
  "pid" integer

  FOREIGN KEY (tid) REFERENCES tags(tid)
  FOREIGN KEY (pid) REFERENCES posts(pid) ON DELETE CASCADE 
  PRIMARY KEY(tid, pid)
);





/* 관계테이블에는 pid 에 ON DELETE CASCADE 속성 따로 추가해야함 */
/* uid 에도 추가해야 함 */


INSERT INTO "posts"("title", "content", "upload_date", "image_location", "is_blog") VALUES('sample_title', 'sample_content', now()::timestamp, '/images/sample_image.jpg', '\000');




router.get('/api/get/post', (req, res, next) => {
  const post_id = req.query.post_id

  pool.query(`SELECT * FROM posts
              WHERE pid=$1`, [ post_id ],
              (q_err, q_res) => {
                res.json(q_res.rows)
      })
} )