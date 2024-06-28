CREATE TABLE "posts" (
  "pid" integer PRIMARY KEY,
  "title" varchar,
  "content" text,
  "upload_date" timestamp,
  "image_location" text,
  "is_blog" bytea
);

CREATE TABLE "tags" (
  "tid" integer PRIMARY KEY,
  "tag_name" text
);

CREATE TABLE "post_tag" (
  "tid" integer,
  "pid" integer
);

ALTER TABLE "post_tag" ADD FOREIGN KEY ("tid") REFERENCES "tags" ("tid");

ALTER TABLE "post_tag" ADD FOREIGN KEY ("pid") REFERENCES "posts" ("pid");


INSERT INTO "posts"("pid", "title", "content", "upload_date", "image_location", "is_blog") VALUES(1, 'sample_title1', 'sample_content1', now()::timestamp, '/images/sample_image.jpg', '\000');
INSERT INTO "posts"("pid", "title", "content", "upload_date", "image_location", "is_blog") VALUES(2, 'sample_title2', 'sample_content2', now()::timestamp, '/images/sample_image.jpg', '\000');
INSERT INTO "posts"("pid", "title", "content", "upload_date", "image_location", "is_blog") VALUES(3, 'sample_title3', 'sample_content3', now()::timestamp, '/images/sample_image.jpg', '\000');
INSERT INTO "posts"("pid", "title", "content", "upload_date", "image_location", "is_blog") VALUES(4, 'sample_title4', 'sample_content4', now()::timestamp, '/images/sample_image.jpg', '\000');
INSERT INTO "posts"("pid", "title", "content", "upload_date", "image_location", "is_blog") VALUES(5, 'sample_title5', 'sample_content5', now()::timestamp, '/images/sample_image.jpg', '\000');
INSERT INTO "posts"("pid", "title", "content", "upload_date", "image_location", "is_blog") VALUES(6, 'sample_title6', 'sample_content6', now()::timestamp, '/images/sample_image.jpg', '\000');
INSERT INTO "posts"("pid", "title", "content", "upload_date", "image_location", "is_blog") VALUES(7, 'sample_title7', '
---

# h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading


## Horizontal Rules

___

---

***


## Typographic replacements

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and ''single quotes''


## Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_
', now()::timestamp, '/images/sample_image.jpg', '\000');



UPDATE "posts" SET "image_location" = '/images/sample_data' WHERE "pid" = 1;

UPDATE "posts" SET "content" = '**This is bold text**

__This is bold text__

*This is italic text*' WHERE "pid" = 2;

UPDATE "posts" SET "content" = 'Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and ''single quotes''' WHERE "pid" = 5;

UPDATE "posts" SET "content" = '
# h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading


## Horizontal Rules

___

---

***' WHERE "pid" = 6;



router.get('/api/get/post', (req, res, next) => {
  const post_id = req.query.post_id

  pool.query(`SELECT * FROM posts
              WHERE pid=$1`, [ post_id ],
              (q_err, q_res) => {
                res.json(q_res.rows)
      })
} )