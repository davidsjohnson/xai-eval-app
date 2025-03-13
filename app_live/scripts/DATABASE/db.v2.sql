CREATE TABLE IF NOT EXISTS "patient" (
	"id" INTEGER NOT NULL UNIQUE,
	"name" TEXT NOT NULL,
	"sex" TEXT NOT NULL,
	"age" INTEGER NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "image" (
	"id" INTEGER NOT NULL UNIQUE,
	"path" TEXT NOT NULL,
	"patient_id" INTEGER NOT NULL,
	"ai_diagnosis" TEXT NOT NULL,
	"true_diagnosis" TEXT NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY ("patient_id") REFERENCES "patient"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "participant" (
	"id" INTEGER NOT NULL UNIQUE,
	"name" TEXT NOT NULL,
	"age" NUMERIC NOT NULL,
	"sex" TEXT NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "participant_feedback" (
	"id" INTEGER NOT NULL UNIQUE,
	"image_id" INTEGER NOT NULL,
	"participant_id" INTEGER NOT NULL,
	"participant_diagnosis" TEXT NOT NULL,
	"study_id" INTEGER NOT NULL,
	"diagnosis_page_nr" INTEGER NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY ("image_id") REFERENCES "image"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION,
	FOREIGN KEY ("participant_id") REFERENCES "participant"("id")
	ON UPDATE NO ACTION ON DELETE NO ACTION
);
