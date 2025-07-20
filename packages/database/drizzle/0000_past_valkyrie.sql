CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(254) NOT NULL,
	"password" varchar(256) NOT NULL,
	"refreshtoken" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
