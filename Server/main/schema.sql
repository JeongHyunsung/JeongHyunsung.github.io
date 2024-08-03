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

CREATE TABLE "post_tag" (
  "tid" integer REFERENCES posts(pid),
  "pid" integer REFERENCES tags(tid)
  PRIMARY KEY(tid, pid)
);

CREATE TABLE "comments" (
   "cid" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   "parent_cid" integer DEFAULT NULL,
   "nickname" varchar(255) NOT NULL,
   "hashed_password" varchar(60) NOT NULL,
   "content" text NOT NULL,
   "created_at" timestamp,
   "is_approved" boolean DEFAULT FALSE,
   FOREIGN KEY (parent_cid) REFERENCES comments(cid)
);

CREATE TAble "post_comment"(
  "pid" integer REFERENCES posts(pid),
  "cid" integer REFERENCES comments(cid)
);

INSERT INTO "posts"("title", "content", "upload_date", "image_location", "is_blog") VALUES('sample_title', 'sample_content', now()::timestamp, '/images/sample_image.jpg', '\000');




router.get('/api/get/post', (req, res, next) => {
  const post_id = req.query.post_id

  pool.query(`SELECT * FROM posts
              WHERE pid=$1`, [ post_id ],
              (q_err, q_res) => {
                res.json(q_res.rows)
      })
} )