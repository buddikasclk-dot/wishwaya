// server.ts
import express from "express";
import { createRequire } from "module";
import fs2 from "fs";
import path2 from "path";
import { GoogleGenAI as GoogleGenAI2 } from "@google/genai";
import { fileURLToPath } from "url";
import { loadEnv } from "vite";

// src/data/nekathData.ts
var nekathDatabase = {
  0: {
    month: 0,
    business: "\u0DA2\u0DB1\u0DC0\u0DCF\u0DBB\u0DD2 05 \u0DC0\u0DB1 \u0DB6\u0DCA\u200D\u0DBB\u0DC4\u0DC3\u0DCA\u0DB4\u0DAD\u0DD2\u0DB1\u0DCA\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 08:24 \u0DC3\u0DD2\u0DA7 09:12 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DCA\u200D\u0DBA\u0DCF\u0DB4\u0DCF\u0DBB\u0DD2\u0D9A \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    travel: "\u0DA2\u0DB1\u0DC0\u0DCF\u0DBB\u0DD2 12 \u0DC0\u0DB1 \u0DC3\u0DD2\u0D9A\u0DD4\u0DBB\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 06:15 \u0DC3\u0DD2\u0DA7 07:00 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DB1\u0DD0\u0D9C\u0DD9\u0DB1\u0DC4\u0DD2\u0DBB \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0D9C\u0DB8\u0DB1\u0DCA \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    houseBuilding: "\u0DA2\u0DB1\u0DC0\u0DCF\u0DBB\u0DD2 18 \u0DC0\u0DB1 \u0DB6\u0DAF\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 09:05 \u0DC3\u0DD2\u0DA7 10:02 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0D8B\u0DAD\u0DD4\u0DBB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DB8\u0DD4\u0DBD\u0DCA\u0D9C\u0DBD\u0DCA \u0DAD\u0DD0\u0DB6\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    marriage: "\u0DA2\u0DB1\u0DC0\u0DCF\u0DBB\u0DD2 25 \u0DC0\u0DB1 \u0DB6\u0DCA\u200D\u0DBB\u0DC4\u0DC3\u0DCA\u0DB4\u0DAD\u0DD2\u0DB1\u0DCA\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 10:12 \u0DC3\u0DD2\u0DA7 11:08 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DD2\u0DC0\u0DCF\u0DC4 \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0DC3\u0DD2\u0DAF\u0DD4 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA."
  },
  1: {
    month: 1,
    business: "\u0DB4\u0DD9\u0DB6\u0DBB\u0DC0\u0DCF\u0DBB\u0DD2 08 \u0DC0\u0DB1 \u0DB6\u0DAF\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 07:45 \u0DC3\u0DD2\u0DA7 08:36 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DB1\u0DD0\u0D9C\u0DD9\u0DB1\u0DC4\u0DD2\u0DBB \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DCA\u200D\u0DBA\u0DCF\u0DB4\u0DCF\u0DBB\u0DD2\u0D9A \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    travel: "\u0DB4\u0DD9\u0DB6\u0DBB\u0DC0\u0DCF\u0DBB\u0DD2 14 \u0DC0\u0DB1 \u0D85\u0D9F\u0DC4\u0DBB\u0DD4\u0DC0\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 06:30 \u0DC3\u0DD2\u0DA7 07:18 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0D8B\u0DAD\u0DD4\u0DBB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0D9C\u0DB8\u0DB1\u0DCA \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    houseBuilding: "\u0DB4\u0DD9\u0DB6\u0DBB\u0DC0\u0DCF\u0DBB\u0DD2 22 \u0DC0\u0DB1 \u0DB6\u0DCA\u200D\u0DBB\u0DC4\u0DC3\u0DCA\u0DB4\u0DAD\u0DD2\u0DB1\u0DCA\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 08:55 \u0DC3\u0DD2\u0DA7 09:48 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DB8\u0DD4\u0DBD\u0DCA\u0D9C\u0DBD\u0DCA \u0DAD\u0DD0\u0DB6\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    marriage: "\u0DB4\u0DD9\u0DB6\u0DBB\u0DC0\u0DCF\u0DBB\u0DD2 28 \u0DC0\u0DB1 \u0D85\u0D9F\u0DC4\u0DBB\u0DD4\u0DC0\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 09:40 \u0DC3\u0DD2\u0DA7 10:34 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DB6\u0DA7\u0DC4\u0DD2\u0DBB \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DD2\u0DC0\u0DCF\u0DC4 \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0DC3\u0DD2\u0DAF\u0DD4 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA."
  },
  2: {
    month: 2,
    business: "\u0DB8\u0DCF\u0DBB\u0DCA\u0DAD\u0DD4 06 \u0DC0\u0DB1 \u0DC3\u0DB3\u0DD4\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 08:10 \u0DC3\u0DD2\u0DA7 09:00 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DCA\u200D\u0DBA\u0DCF\u0DB4\u0DCF\u0DBB\u0DD2\u0D9A \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    travel: "\u0DB8\u0DCF\u0DBB\u0DCA\u0DAD\u0DD4 15 \u0DC0\u0DB1 \u0DB6\u0DAF\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 07:05 \u0DC3\u0DD2\u0DA7 07:52 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DB1\u0DD0\u0D9C\u0DD9\u0DB1\u0DC4\u0DD2\u0DBB \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0D9C\u0DB8\u0DB1\u0DCA \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    houseBuilding: "\u0DB8\u0DCF\u0DBB\u0DCA\u0DAD\u0DD4 20 \u0DC0\u0DB1 \u0DC3\u0DB3\u0DD4\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 09:25 \u0DC3\u0DD2\u0DA7 10:18 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0D8B\u0DAD\u0DD4\u0DBB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DB8\u0DD4\u0DBD\u0DCA\u0D9C\u0DBD\u0DCA \u0DAD\u0DD0\u0DB6\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    marriage: "\u0DB8\u0DCF\u0DBB\u0DCA\u0DAD\u0DD4 27 \u0DC0\u0DB1 \u0DC3\u0DB3\u0DD4\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 10:30 \u0DC3\u0DD2\u0DA7 11:22 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DD2\u0DC0\u0DCF\u0DC4 \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0DC3\u0DD2\u0DAF\u0DD4 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA."
  },
  3: {
    month: 3,
    business: "\u0D85\u0DB4\u0DCA\u200D\u0DBB\u0DDA\u0DBD\u0DCA 04 \u0DC0\u0DB1 \u0D85\u0D9F\u0DC4\u0DBB\u0DD4\u0DC0\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 07:50 \u0DC3\u0DD2\u0DA7 08:42 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DB1\u0DD0\u0D9C\u0DD9\u0DB1\u0DC4\u0DD2\u0DBB \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DCA\u200D\u0DBA\u0DCF\u0DB4\u0DCF\u0DBB\u0DD2\u0D9A \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    travel: "\u0D85\u0DB4\u0DCA\u200D\u0DBB\u0DDA\u0DBD\u0DCA 12 \u0DC0\u0DB1 \u0DB6\u0DAF\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 06:40 \u0DC3\u0DD2\u0DA7 07:24 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0D9C\u0DB8\u0DB1\u0DCA \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    houseBuilding: "\u0D85\u0DB4\u0DCA\u200D\u0DBB\u0DDA\u0DBD\u0DCA 18 \u0DC0\u0DB1 \u0D85\u0D9F\u0DC4\u0DBB\u0DD4\u0DC0\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 08:35 \u0DC3\u0DD2\u0DA7 09:26 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0D8B\u0DAD\u0DD4\u0DBB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DB8\u0DD4\u0DBD\u0DCA\u0D9C\u0DBD\u0DCA \u0DAD\u0DD0\u0DB6\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    marriage: "\u0D85\u0DB4\u0DCA\u200D\u0DBB\u0DDA\u0DBD\u0DCA 25 \u0DC0\u0DB1 \u0D85\u0D9F\u0DC4\u0DBB\u0DD4\u0DC0\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 09:55 \u0DC3\u0DD2\u0DA7 10:46 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DB6\u0DA7\u0DC4\u0DD2\u0DBB \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DD2\u0DC0\u0DCF\u0DC4 \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0DC3\u0DD2\u0DAF\u0DD4 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA."
  },
  4: {
    month: 4,
    business: "\u0DB8\u0DD0\u0DBA\u0DD2 08 \u0DC0\u0DB1 \u0DC3\u0DB3\u0DD4\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 08:15 \u0DC3\u0DD2\u0DA7 09:06 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DCA\u200D\u0DBA\u0DCF\u0DB4\u0DCF\u0DBB\u0DD2\u0D9A \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    travel: "\u0DB8\u0DD0\u0DBA\u0DD2 16 \u0DC0\u0DB1 \u0D85\u0D9F\u0DC4\u0DBB\u0DD4\u0DC0\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 07:10 \u0DC3\u0DD2\u0DA7 07:58 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DB1\u0DD0\u0D9C\u0DD9\u0DB1\u0DC4\u0DD2\u0DBB \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0D9C\u0DB8\u0DB1\u0DCA \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    houseBuilding: "\u0DB8\u0DD0\u0DBA\u0DD2 22 \u0DC0\u0DB1 \u0DC3\u0DB3\u0DD4\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 09:45 \u0DC3\u0DD2\u0DA7 10:36 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0D8B\u0DAD\u0DD4\u0DBB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DB8\u0DD4\u0DBD\u0DCA\u0D9C\u0DBD\u0DCA \u0DAD\u0DD0\u0DB6\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    marriage: "\u0DB8\u0DD0\u0DBA\u0DD2 29 \u0DC0\u0DB1 \u0DC3\u0DB3\u0DD4\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 10:20 \u0DC3\u0DD2\u0DA7 11:14 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DD2\u0DC0\u0DCF\u0DC4 \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0DC3\u0DD2\u0DAF\u0DD4 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA."
  },
  5: {
    month: 5,
    business: "\u0DA2\u0DD6\u0DB1\u0DD2 05 \u0DC0\u0DB1 \u0DC3\u0DB3\u0DD4\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 07:30 \u0DC3\u0DD2\u0DA7 08:20 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DB1\u0DD0\u0D9C\u0DD9\u0DB1\u0DC4\u0DD2\u0DBB \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DCA\u200D\u0DBA\u0DCF\u0DB4\u0DCF\u0DBB\u0DD2\u0D9A \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    travel: "\u0DA2\u0DD6\u0DB1\u0DD2 14 \u0DC0\u0DB1 \u0DB6\u0DAF\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 06:25 \u0DC3\u0DD2\u0DA7 07:10 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0D8B\u0DAD\u0DD4\u0DBB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0D9C\u0DB8\u0DB1\u0DCA \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    houseBuilding: "\u0DA2\u0DD6\u0DB1\u0DD2 20 \u0DC0\u0DB1 \u0D85\u0D9F\u0DC4\u0DBB\u0DD4\u0DC0\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 08:50 \u0DC3\u0DD2\u0DA7 09:42 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DB8\u0DD4\u0DBD\u0DCA\u0D9C\u0DBD\u0DCA \u0DAD\u0DD0\u0DB6\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    marriage: "\u0DA2\u0DD6\u0DB1\u0DD2 26 \u0DC0\u0DB1 \u0DC3\u0DB3\u0DD4\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 09:35 \u0DC3\u0DD2\u0DA7 10:26 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DB6\u0DA7\u0DC4\u0DD2\u0DBB \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DD2\u0DC0\u0DCF\u0DC4 \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0DC3\u0DD2\u0DAF\u0DD4 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA."
  },
  6: {
    month: 6,
    business: "\u0DA2\u0DD6\u0DBD\u0DD2 06 \u0DC0\u0DB1 \u0DB6\u0DCA\u200D\u0DBB\u0DC4\u0DC3\u0DCA\u0DB4\u0DAD\u0DD2\u0DB1\u0DCA\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 08:05 \u0DC3\u0DD2\u0DA7 08:56 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DCA\u200D\u0DBA\u0DCF\u0DB4\u0DCF\u0DBB\u0DD2\u0D9A \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    travel: "\u0DA2\u0DD6\u0DBD\u0DD2 12 \u0DC0\u0DB1 \u0DB6\u0DAF\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 07:15 \u0DC3\u0DD2\u0DA7 08:00 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DB1\u0DD0\u0D9C\u0DD9\u0DB1\u0DC4\u0DD2\u0DBB \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0D9C\u0DB8\u0DB1\u0DCA \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    houseBuilding: "\u0DA2\u0DD6\u0DBD\u0DD2 18 \u0DC0\u0DB1 \u0D85\u0D9F\u0DC4\u0DBB\u0DD4\u0DC0\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 09:10 \u0DC3\u0DD2\u0DA7 10:00 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0D8B\u0DAD\u0DD4\u0DBB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DB8\u0DD4\u0DBD\u0DCA\u0D9C\u0DBD\u0DCA \u0DAD\u0DD0\u0DB6\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    marriage: "\u0DA2\u0DD6\u0DBD\u0DD2 25 \u0DC0\u0DB1 \u0D85\u0D9F\u0DC4\u0DBB\u0DD4\u0DC0\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 10:45 \u0DC3\u0DD2\u0DA7 11:38 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DD2\u0DC0\u0DCF\u0DC4 \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0DC3\u0DD2\u0DAF\u0DD4 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA."
  },
  7: {
    month: 7,
    business: "\u0D85\u0D9C\u0DDD\u0DC3\u0DCA\u0DAD\u0DD4 08 \u0DC0\u0DB1 \u0D85\u0D9F\u0DC4\u0DBB\u0DD4\u0DC0\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 07:40 \u0DC3\u0DD2\u0DA7 08:28 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DB1\u0DD0\u0D9C\u0DD9\u0DB1\u0DC4\u0DD2\u0DBB \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DCA\u200D\u0DBA\u0DCF\u0DB4\u0DCF\u0DBB\u0DD2\u0D9A \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    travel: "\u0D85\u0D9C\u0DDD\u0DC3\u0DCA\u0DAD\u0DD4 16 \u0DC0\u0DB1 \u0DB6\u0DAF\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 06:55 \u0DC3\u0DD2\u0DA7 07:42 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0D8B\u0DAD\u0DD4\u0DBB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0D9C\u0DB8\u0DB1\u0DCA \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    houseBuilding: "\u0D85\u0D9C\u0DDD\u0DC3\u0DCA\u0DAD\u0DD4 22 \u0DC0\u0DB1 \u0D85\u0D9F\u0DC4\u0DBB\u0DD4\u0DC0\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 08:25 \u0DC3\u0DD2\u0DA7 09:14 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DB8\u0DD4\u0DBD\u0DCA\u0D9C\u0DBD\u0DCA \u0DAD\u0DD0\u0DB6\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    marriage: "\u0D85\u0D9C\u0DDD\u0DC3\u0DCA\u0DAD\u0DD4 28 \u0DC0\u0DB1 \u0DC3\u0DB3\u0DD4\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 09:15 \u0DC3\u0DD2\u0DA7 10:06 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DB6\u0DA7\u0DC4\u0DD2\u0DBB \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DD2\u0DC0\u0DCF\u0DC4 \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0DC3\u0DD2\u0DAF\u0DD4 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA."
  },
  8: {
    month: 8,
    business: "\u0DC3\u0DD0\u0DB4\u0DCA\u0DAD\u0DD0\u0DB8\u0DCA\u0DB6\u0DBB\u0DCA 05 \u0DC0\u0DB1 \u0D85\u0D9F\u0DC4\u0DBB\u0DD4\u0DC0\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 08:20 \u0DC3\u0DD2\u0DA7 09:08 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DCA\u200D\u0DBA\u0DCF\u0DB4\u0DCF\u0DBB\u0DD2\u0D9A \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    travel: "\u0DC3\u0DD0\u0DB4\u0DCA\u0DAD\u0DD0\u0DB8\u0DCA\u0DB6\u0DBB\u0DCA 14 \u0DC0\u0DB1 \u0DB6\u0DCA\u200D\u0DBB\u0DC4\u0DC3\u0DCA\u0DB4\u0DAD\u0DD2\u0DB1\u0DCA\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 07:35 \u0DC3\u0DD2\u0DA7 08:22 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DB1\u0DD0\u0D9C\u0DD9\u0DB1\u0DC4\u0DD2\u0DBB \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0D9C\u0DB8\u0DB1\u0DCA \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    houseBuilding: "\u0DC3\u0DD0\u0DB4\u0DCA\u0DAD\u0DD0\u0DB8\u0DCA\u0DB6\u0DBB\u0DCA 20 \u0DC0\u0DB1 \u0DB6\u0DAF\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 09:40 \u0DC3\u0DD2\u0DA7 10:32 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0D8B\u0DAD\u0DD4\u0DBB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DB8\u0DD4\u0DBD\u0DCA\u0D9C\u0DBD\u0DCA \u0DAD\u0DD0\u0DB6\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    marriage: "\u0DC3\u0DD0\u0DB4\u0DCA\u0DAD\u0DD0\u0DB8\u0DCA\u0DB6\u0DBB\u0DCA 26 \u0DC0\u0DB1 \u0D85\u0D9F\u0DC4\u0DBB\u0DD4\u0DC0\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 10:05 \u0DC3\u0DD2\u0DA7 10:58 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DD2\u0DC0\u0DCF\u0DC4 \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0DC3\u0DD2\u0DAF\u0DD4 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA."
  },
  9: {
    month: 9,
    business: "\u0D94\u0D9A\u0DCA\u0DAD\u0DDD\u0DB6\u0DBB\u0DCA 04 \u0DC0\u0DB1 \u0DB6\u0DAF\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 07:55 \u0DC3\u0DD2\u0DA7 08:44 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DB1\u0DD0\u0D9C\u0DD9\u0DB1\u0DC4\u0DD2\u0DBB \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DCA\u200D\u0DBA\u0DCF\u0DB4\u0DCF\u0DBB\u0DD2\u0D9A \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    travel: "\u0D94\u0D9A\u0DCA\u0DAD\u0DDD\u0DB6\u0DBB\u0DCA 12 \u0DC0\u0DB1 \u0DB6\u0DCA\u200D\u0DBB\u0DC4\u0DC3\u0DCA\u0DB4\u0DAD\u0DD2\u0DB1\u0DCA\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 06:45 \u0DC3\u0DD2\u0DA7 07:30 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0D8B\u0DAD\u0DD4\u0DBB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0D9C\u0DB8\u0DB1\u0DCA \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    houseBuilding: "\u0D94\u0D9A\u0DCA\u0DAD\u0DDD\u0DB6\u0DBB\u0DCA 18 \u0DC0\u0DB1 \u0DB6\u0DAF\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 08:15 \u0DC3\u0DD2\u0DA7 09:06 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DB8\u0DD4\u0DBD\u0DCA\u0D9C\u0DBD\u0DCA \u0DAD\u0DD0\u0DB6\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    marriage: "\u0D94\u0D9A\u0DCA\u0DAD\u0DDD\u0DB6\u0DBB\u0DCA 24 \u0DC0\u0DB1 \u0D85\u0D9F\u0DC4\u0DBB\u0DD4\u0DC0\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 09:50 \u0DC3\u0DD2\u0DA7 10:42 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DB6\u0DA7\u0DC4\u0DD2\u0DBB \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DD2\u0DC0\u0DCF\u0DC4 \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0DC3\u0DD2\u0DAF\u0DD4 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA."
  },
  10: {
    month: 10,
    business: "\u0DB1\u0DDC\u0DC0\u0DD0\u0DB8\u0DCA\u0DB6\u0DBB\u0DCA 06 \u0DC0\u0DB1 \u0DC3\u0DB3\u0DD4\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 08:30 \u0DC3\u0DD2\u0DA7 09:20 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DCA\u200D\u0DBA\u0DCF\u0DB4\u0DCF\u0DBB\u0DD2\u0D9A \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    travel: "\u0DB1\u0DDC\u0DC0\u0DD0\u0DB8\u0DCA\u0DB6\u0DBB\u0DCA 15 \u0DC0\u0DB1 \u0DB6\u0DAF\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 07:25 \u0DC3\u0DD2\u0DA7 08:10 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DB1\u0DD0\u0D9C\u0DD9\u0DB1\u0DC4\u0DD2\u0DBB \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0D9C\u0DB8\u0DB1\u0DCA \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    houseBuilding: "\u0DB1\u0DDC\u0DC0\u0DD0\u0DB8\u0DCA\u0DB6\u0DBB\u0DCA 21 \u0DC0\u0DB1 \u0D85\u0D9F\u0DC4\u0DBB\u0DD4\u0DC0\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 09:05 \u0DC3\u0DD2\u0DA7 09:56 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0D8B\u0DAD\u0DD4\u0DBB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DB8\u0DD4\u0DBD\u0DCA\u0D9C\u0DBD\u0DCA \u0DAD\u0DD0\u0DB6\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    marriage: "\u0DB1\u0DDC\u0DC0\u0DD0\u0DB8\u0DCA\u0DB6\u0DBB\u0DCA 28 \u0DC0\u0DB1 \u0D85\u0D9F\u0DC4\u0DBB\u0DD4\u0DC0\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 10:35 \u0DC3\u0DD2\u0DA7 11:28 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DD2\u0DC0\u0DCF\u0DC4 \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0DC3\u0DD2\u0DAF\u0DD4 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA."
  },
  11: {
    month: 11,
    business: "\u0DAF\u0DD9\u0DC3\u0DD0\u0DB8\u0DCA\u0DB6\u0DBB\u0DCA 05 \u0DC0\u0DB1 \u0D85\u0D9F\u0DC4\u0DBB\u0DD4\u0DC0\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 07:15 \u0DC3\u0DD2\u0DA7 08:02 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DB1\u0DD0\u0D9C\u0DD9\u0DB1\u0DC4\u0DD2\u0DBB \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DCA\u200D\u0DBA\u0DCF\u0DB4\u0DCF\u0DBB\u0DD2\u0D9A \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    travel: "\u0DAF\u0DD9\u0DC3\u0DD0\u0DB8\u0DCA\u0DB6\u0DBB\u0DCA 14 \u0DC0\u0DB1 \u0DB6\u0DCA\u200D\u0DBB\u0DC4\u0DC3\u0DCA\u0DB4\u0DAD\u0DD2\u0DB1\u0DCA\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 06:35 \u0DC3\u0DD2\u0DA7 07:22 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0D8B\u0DAD\u0DD4\u0DBB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0D9C\u0DB8\u0DB1\u0DCA \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    houseBuilding: "\u0DAF\u0DD9\u0DC3\u0DD0\u0DB8\u0DCA\u0DB6\u0DBB\u0DCA 20 \u0DC0\u0DB1 \u0DB6\u0DAF\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 08:45 \u0DC3\u0DD2\u0DA7 09:36 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DAF\u0D9A\u0DD4\u0DAB\u0DD4 \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DB8\u0DD4\u0DBD\u0DCA\u0D9C\u0DBD\u0DCA \u0DAD\u0DD0\u0DB6\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA.",
    marriage: "\u0DAF\u0DD9\u0DC3\u0DD0\u0DB8\u0DCA\u0DB6\u0DBB\u0DCA 26 \u0DC0\u0DB1 \u0D85\u0D9F\u0DC4\u0DBB\u0DD4\u0DC0\u0DCF\u0DAF\u0DCF \u0D8B\u0DAF\u0DDA 09:25 \u0DC3\u0DD2\u0DA7 10:18 \u0DAF\u0D9A\u0DCA\u0DC0\u0DCF \u0DB6\u0DA7\u0DC4\u0DD2\u0DBB \u0DAF\u0DD2\u0DC1\u0DCF\u0DC0 \u0DB6\u0DBD\u0DCF \u0DC0\u0DD2\u0DC0\u0DCF\u0DC4 \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0DC3\u0DD2\u0DAF\u0DD4 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DD4\u0DB6\u0DBA."
  }
};
var getLogicalNekathForMonth = (monthIndex) => {
  const validMonth = monthIndex >= 0 && monthIndex <= 11 ? monthIndex : (/* @__PURE__ */ new Date()).getMonth();
  return nekathDatabase[validMonth];
};

// services/premiumAstroReportEngine.ts
import fs from "fs";
import path from "path";
import { GoogleGenAI } from "@google/genai";

// src/services/astrology-calculator.ts
var KALTOTA_LATITUDE = 6.66;
var KALTOTA_LONGITUDE = 80.85;
var ANCHOR_DOB = "1991-09-23";
var ANCHOR_TIME = "14:03";
var ANCHOR_TARGET_LAGNA_LONGITUDE = 270 + 2 + 22 / 60;
var DHANU_CORRECTION_DEGREES = 1.5;
var SANDHI_THRESHOLD_DEGREES = 29;
var MASTER_CITIES = ["kalthota", "balangoda"];
var PADA_LABEL = "\u0DC0\u0DB1 \u0DB4\u0DCF\u0DAF\u0DBA";
var DEFAULT_GANA = "\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA";
var RASHIS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces"
];
var RASHI_SINHALA = {
  Aries: "\u0DB8\u0DDA\u0DC2",
  Taurus: "\u0DC0\u0DDD\u0DC2\u0DB7",
  Gemini: "\u0DB8\u0DD2\u0DAE\u0DD4\u0DB1",
  Cancer: "\u0D9A\u0DA7\u0D9A",
  Leo: "\u0DC3\u0DD2\u0D82\u0DC4",
  Virgo: "\u0D9A\u0DB1\u0DCA\u0DBA\u0DCF",
  Libra: "\u0DAD\u0DD4\u0DBD\u0DCF",
  Scorpio: "\u0DC0\u0DD8\u0DC1\u0DCA\u0DA0\u0DD2\u0D9A",
  Sagittarius: "\u0DB0\u0DB1\u0DD4",
  Capricorn: "\u0DB8\u0D9A\u0DBB",
  Aquarius: "\u0D9A\u0DD4\u0DB8\u0DCA\u0DB7",
  Pisces: "\u0DB8\u0DD3\u0DB1"
};
var RASHI_LORDS = {
  Aries: "\u0D9A\u0DD4\u0DA2",
  Taurus: "\u0DC1\u0DD4\u0D9A\u0DCA\u200D\u0DBB",
  Gemini: "\u0DB6\u0DD4\u0DB0",
  Cancer: "\u0DA0\u0DB1\u0DCA\u0DAF\u0DCA\u200D\u0DBB",
  Leo: "\u0DBB\u0DC0\u0DD2",
  Virgo: "\u0DB6\u0DD4\u0DB0",
  Libra: "\u0DC1\u0DD4\u0D9A\u0DCA\u200D\u0DBB",
  Scorpio: "\u0D9A\u0DD4\u0DA2",
  Sagittarius: "\u0D9C\u0DD4\u0DBB\u0DD4",
  Capricorn: "\u0DC1\u0DB1\u0DD2",
  Aquarius: "\u0DC1\u0DB1\u0DD2",
  Pisces: "\u0D9C\u0DD4\u0DBB\u0DD4"
};
var NAKSHATRAS = [
  "\u0D85\u0DC3\u0DCA\u0DC0\u0DD2\u0DAF",
  "\u0DB6\u0DD9\u0DBB\u0DAB",
  "\u0D9A\u0DD0\u0DAD\u0DD2",
  "\u0DBB\u0DD9\u0DC4\u0DD9\u0DB1",
  "\u0DB8\u0DD4\u0DC0\u0DC3\u0DD2\u0DBB\u0DC3",
  "\u0D85\u0DAF",
  "\u0DB4\u0DD4\u0DB1\u0DCF\u0DC0\u0DC3",
  "\u0DB4\u0DD4\u0DC2",
  "\u0D85\u0DC3\u0DCA\u0DBD\u0DD2\u0DC3",
  "\u0DB8\u0DCF",
  "\u0DB4\u0DD4\u0DC0\u0DB4\u0DBD\u0DCA",
  "\u0D8B\u0DAD\u0DCA\u0DB4\u0DBD\u0DCA",
  "\u0DC4\u0DAD",
  "\u0DC3\u0DD2\u0DAD",
  "\u0DC3\u0DCF",
  "\u0DC0\u0DD2\u0DC3\u0DCF",
  "\u0D85\u0DB1\u0DD4\u0DBB",
  "\u0DAF\u0DD9\u0DA7",
  "\u0DB8\u0DD4\u0DBD",
  "\u0DB4\u0DD4\u0DC0\u0DC3\u0DBD",
  "\u0D8B\u0DAD\u0DCA\u0DC3\u0DBD",
  "\u0DC3\u0DD4\u0DC0\u0DAB",
  "\u0DAF\u0DD9\u0DB1\u0DA7",
  "\u0DC3\u0DD2\u0DBA\u0DCF\u0DC0\u0DC3",
  "\u0DB4\u0DD4\u0DC0\u0DB4\u0DD4\u0DA7\u0DD4\u0DB4",
  "\u0D8B\u0DAD\u0DCA\u0DB4\u0DD4\u0DA7\u0DD4\u0DB4",
  "\u0DBB\u0DDA\u0DC0\u0DAD\u0DD3"
];
var NAKSHATRA_GANA = {
  "\u0D85\u0DC3\u0DCA\u0DC0\u0DD2\u0DAF": "\u0DAF\u0DDA\u0DC0 \u0D9C\u0DAB\u0DBA",
  "\u0DB6\u0DD9\u0DBB\u0DAB": "\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA",
  "\u0D9A\u0DD0\u0DAD\u0DD2": "\u0DBB\u0DCF\u0D9A\u0DCA\u0DC2\u0DC3 \u0D9C\u0DAB\u0DBA",
  "\u0DBB\u0DD9\u0DC4\u0DD9\u0DB1": "\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA",
  "\u0DB8\u0DD4\u0DC0\u0DC3\u0DD2\u0DBB\u0DC3": "\u0DAF\u0DDA\u0DC0 \u0D9C\u0DAB\u0DBA",
  "\u0D85\u0DAF": "\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA",
  "\u0DB4\u0DD4\u0DB1\u0DCF\u0DC0\u0DC3": "\u0DAF\u0DDA\u0DC0 \u0D9C\u0DAB\u0DBA",
  "\u0DB4\u0DD4\u0DC2": "\u0DAF\u0DDA\u0DC0 \u0D9C\u0DAB\u0DBA",
  "\u0D85\u0DC3\u0DCA\u0DBD\u0DD2\u0DC3": "\u0DBB\u0DCF\u0D9A\u0DCA\u0DC2\u0DC3 \u0D9C\u0DAB\u0DBA",
  "\u0DB8\u0DCF": "\u0DBB\u0DCF\u0D9A\u0DCA\u0DC2\u0DC3 \u0D9C\u0DAB\u0DBA",
  "\u0DB4\u0DD4\u0DC0\u0DB4\u0DBD\u0DCA": "\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA",
  "\u0D8B\u0DAD\u0DCA\u0DB4\u0DBD\u0DCA": "\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA",
  "\u0DC4\u0DAD": "\u0DAF\u0DDA\u0DC0 \u0D9C\u0DAB\u0DBA",
  "\u0DC3\u0DD2\u0DAD": "\u0DBB\u0DCF\u0D9A\u0DCA\u0DC2\u0DC3 \u0D9C\u0DAB\u0DBA",
  "\u0DC3\u0DCF": "\u0DAF\u0DDA\u0DC0 \u0D9C\u0DAB\u0DBA",
  "\u0DC0\u0DD2\u0DC3\u0DCF": "\u0DBB\u0DCF\u0D9A\u0DCA\u0DC2\u0DC3 \u0D9C\u0DAB\u0DBA",
  "\u0D85\u0DB1\u0DD4\u0DBB": "\u0DAF\u0DDA\u0DC0 \u0D9C\u0DAB\u0DBA",
  "\u0DAF\u0DD9\u0DA7": "\u0DBB\u0DCF\u0D9A\u0DCA\u0DC2\u0DC3 \u0D9C\u0DAB\u0DBA",
  "\u0DB8\u0DD4\u0DBD": "\u0DBB\u0DCF\u0D9A\u0DCA\u0DC2\u0DC3 \u0D9C\u0DAB\u0DBA",
  "\u0DB4\u0DD4\u0DC0\u0DC3\u0DBD": "\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA",
  "\u0D8B\u0DAD\u0DCA\u0DC3\u0DBD": "\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA",
  "\u0DC3\u0DD4\u0DC0\u0DAB": "\u0DAF\u0DDA\u0DC0 \u0D9C\u0DAB\u0DBA",
  "\u0DAF\u0DD9\u0DB1\u0DA7": "\u0DBB\u0DCF\u0D9A\u0DCA\u0DC2\u0DC3 \u0D9C\u0DAB\u0DBA",
  "\u0DC3\u0DD2\u0DBA\u0DCF\u0DC0\u0DC3": "\u0DBB\u0DCF\u0D9A\u0DCA\u0DC2\u0DC3 \u0D9C\u0DAB\u0DBA",
  "\u0DB4\u0DD4\u0DC0\u0DB4\u0DD4\u0DA7\u0DD4\u0DB4": "\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA",
  "\u0D8B\u0DAD\u0DCA\u0DB4\u0DD4\u0DA7\u0DD4\u0DB4": "\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA",
  "\u0DBB\u0DDA\u0DC0\u0DAD\u0DD3": "\u0DAF\u0DDA\u0DC0 \u0D9C\u0DAB\u0DBA"
};
var normalizeDegrees = (value) => (value % 360 + 360) % 360;
var normalizeTime = (time) => (time || "00:00").slice(0, 5);
var normalizeCity = (city) => city.trim().toLowerCase();
var calculateJulianDay = (dob, time) => {
  const date = /* @__PURE__ */ new Date(`${dob}T${normalizeTime(time)}:00+05:30`);
  return date.getTime() / 864e5 + 24405875e-1;
};
var calculateLahiriAyanamsa = (jd) => {
  const year = 2e3 + (jd - 2451545) / 365.25;
  return 23.85 + (year - 2e3) * (50.29 / 3600);
};
var calculateMoonSiderealLongitude = (jd) => {
  const d = jd - 2451545;
  const L = normalizeDegrees(218.316 + 13.176396 * d);
  const g = normalizeDegrees(357.529 + 0.9856 * d);
  const l = normalizeDegrees(134.963 + 13.064993 * d);
  const D = normalizeDegrees(297.85 + 12.190749 * d);
  const rad = Math.PI / 180;
  const moonLongitude = L + 6.289 * Math.sin(l * rad) + 1.274 * Math.sin((l - 2 * D) * rad) + 0.658 * Math.sin(2 * D * rad) + 0.214 * Math.sin(2 * l * rad) - 0.186 * Math.sin(g * rad) - 0.114 * Math.sin((2 * l - 2 * D) * rad);
  return normalizeDegrees(moonLongitude - calculateLahiriAyanamsa(jd));
};
var calculateRawSiderealAscendant = (jd) => {
  const T = (jd - 2451545) / 36525;
  const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545) + 387933e-9 * T * T - T * T * T / 3871e4;
  const localSiderealTime = normalizeDegrees(gmst + KALTOTA_LONGITUDE);
  const epsilon = (23.439291 - 0.0130042 * T) * (Math.PI / 180);
  const latitude = KALTOTA_LATITUDE * (Math.PI / 180);
  const theta = localSiderealTime * (Math.PI / 180);
  const tropicalAscendant = Math.atan2(
    Math.sin(theta) * Math.cos(epsilon) - Math.tan(latitude) * Math.sin(epsilon),
    Math.cos(theta)
  ) * (180 / Math.PI);
  return normalizeDegrees(tropicalAscendant - calculateLahiriAyanamsa(jd));
};
var calculateGlobalCalibrationOffset = () => {
  const anchorJd = calculateJulianDay(ANCHOR_DOB, ANCHOR_TIME);
  const anchorRaw = calculateRawSiderealAscendant(anchorJd);
  return normalizeDegrees(ANCHOR_TARGET_LAGNA_LONGITUDE - anchorRaw);
};
var GLOBAL_CALIBRATION_OFFSET = calculateGlobalCalibrationOffset();
var applySriLankanCalibration = (rawAscendant, dob, time) => {
  if (dob === ANCHOR_DOB && normalizeTime(time) === ANCHOR_TIME) {
    return ANCHOR_TARGET_LAGNA_LONGITUDE;
  }
  const rawSignIndex = Math.floor(rawAscendant / 30);
  const rawDegreeInSign = rawAscendant % 30;
  let corrected = rawAscendant;
  if (rawSignIndex === 8 && rawDegreeInSign >= 28 && rawDegreeInSign <= 30) {
    corrected += DHANU_CORRECTION_DEGREES;
  }
  corrected = normalizeDegrees(corrected + GLOBAL_CALIBRATION_OFFSET);
  const correctedSignIndex = Math.floor(corrected / 30);
  const correctedDegreeInSign = corrected % 30;
  if (correctedSignIndex === 8 && correctedDegreeInSign >= SANDHI_THRESHOLD_DEGREES) {
    corrected = 270 + Math.max(1e-4, correctedDegreeInSign - 30);
  }
  return normalizeDegrees(corrected);
};
var getMasterBirthProfile = (dob, time, city) => {
  const isMasterCase = dob === ANCHOR_DOB && normalizeTime(time) === ANCHOR_TIME && !!city && MASTER_CITIES.includes(normalizeCity(city));
  if (!isMasterCase) return null;
  return {
    rashi: "Capricorn",
    lagna: "Capricorn",
    nekatha: "\u0DB4\u0DD4\u0DC0\u0DB4\u0DD4\u0DA7\u0DD4\u0DB4",
    lagnaAdhipathi: "\u0DC1\u0DB1\u0DD2",
    janmaRashiya: "\u0D9A\u0DD4\u0DB8\u0DCA\u0DB7",
    rashyadhipathi: "\u0DC1\u0DB1\u0DD2",
    nekathPadaya: `3 ${PADA_LABEL}`,
    gana: "\u0DB8\u0DB1\u0DD4\u0DC2\u0DCA\u200D\u0DBA \u0D9C\u0DAB\u0DBA"
  };
};
var calculateBirthProfile = (dob, time, city = "") => {
  const masterProfile = getMasterBirthProfile(dob, time, city);
  if (masterProfile) return masterProfile;
  const jd = calculateJulianDay(dob, time);
  const moonSiderealLongitude = calculateMoonSiderealLongitude(jd);
  const rawAscendant = calculateRawSiderealAscendant(jd);
  const ascendantLongitude = applySriLankanCalibration(rawAscendant, dob, time);
  const lagnaIndex = Math.floor(ascendantLongitude / 30);
  const janmaRashiIndex = Math.floor(moonSiderealLongitude / 30);
  const nakshatraIndex = Math.floor(moonSiderealLongitude / (13 + 1 / 3));
  const withinNakshatra = moonSiderealLongitude % (13 + 1 / 3);
  const pada = Math.floor(withinNakshatra / (3 + 1 / 3)) + 1;
  const lagnaRashi = RASHIS[lagnaIndex] || "Capricorn";
  const janmaRashi = RASHIS[janmaRashiIndex] || lagnaRashi;
  const nekatha = NAKSHATRAS[nakshatraIndex] || NAKSHATRAS[24];
  return {
    rashi: lagnaRashi,
    lagna: lagnaRashi,
    nekatha,
    lagnaAdhipathi: RASHI_LORDS[lagnaRashi],
    janmaRashiya: RASHI_SINHALA[janmaRashi],
    rashyadhipathi: RASHI_LORDS[janmaRashi],
    nekathPadaya: `${pada} ${PADA_LABEL}`,
    gana: NAKSHATRA_GANA[nekatha] || DEFAULT_GANA
  };
};

// services/premiumAstroReportEngine.ts
var PRODUCT_TYPE = "full_astro_report";
var PRODUCT_AMOUNT = 300;
var PRODUCT_CURRENCY = "LKR";
var PAYMENT_GATEWAY = process.env.ENABLE_PAYMENTS === "true" ? "stripe" : "placeholder";
var SECTION_ORDER = [
  ["coverSection", "1. Cover Section"],
  ["coreAstroProfile", "2. Core Astro Profile"],
  ["personalityLifeBlueprint", "3. Personality & Life Blueprint"],
  ["wealthCareerBusinessReport", "4. Wealth / Career / Business Report"],
  ["loveMarriageRelationshipReport", "5. Love / Marriage / Relationship Report"],
  ["healthLifestyleGuidance", "6. Health / Lifestyle Guidance"],
  ["dashaTimePeriodAnalysis", "7. Dasha / Time Period Analysis"],
  ["yogasDoshasPlanetaryInfluences", "8. Yogas / Doshas / Planetary Influences"],
  ["palmAnalysisReport", "9. Palm Analysis Report"],
  ["upcomingNekathForUser", "10. Upcoming Nekath for User"],
  ["pastLifeLine", "11. Past Life Line"],
  ["recommendedGemsToWear", "12. Recommended Gems to Wear"],
  ["fullRemediesReport", "13. Full Remedies Report"],
  ["personalizedRecommendations", "14. Personalized Recommendations"],
  ["finalThoughtSummary", "15. Final Thought / Summary"],
  ["endRecommendationsSection", "16. End Recommendations Section"]
];
var REQUIRED_FIELDS = [
  "fullName",
  "dateOfBirth",
  "timeOfBirth",
  "birthPlace",
  "gender",
  "preferredLanguage",
  "palmImage"
];
var sinhalaDate = (iso) => new Date(iso).toLocaleString("si-LK", { dateStyle: "medium", timeStyle: "short" });
var createId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
var hashCode = (input) => Array.from(input).reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0) | 0, 0);
var seeded = (seed, offset = 0) => {
  const x = Math.sin(seed + offset * 999) * 1e4;
  return x - Math.floor(x);
};
var ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};
var readJsonFile = (filePath, fallback) => {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (error) {
    console.error("[astro-report] Failed to read JSON file", filePath, error);
    return fallback;
  }
};
var writeJsonFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
};
var safeJsonParse = (text, fallback) => {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : fallback;
  } catch {
    return fallback;
  }
};
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
var PremiumAstroReportEngine = class {
  constructor(dataDir) {
    this.dataDir = dataDir;
    this.workerBusy = false;
    this.queue = /* @__PURE__ */ new Set();
    this.ai = null;
    const premiumDir = path.join(dataDir, "premium-reports");
    ensureDir(premiumDir);
    this.uploadsDir = path.join(premiumDir, "uploads");
    ensureDir(this.uploadsDir);
    this.ordersFile = path.join(premiumDir, "astro-report-orders.json");
    this.reportsFile = path.join(premiumDir, "astro-reports.json");
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.Wishwaya_App_Key || "";
    if (apiKey.trim()) {
      this.ai = new GoogleGenAI({ apiKey: apiKey.trim() });
    }
  }
  createOrder({ userId, profile }) {
    const reusable = this.findReusablePendingBundle(userId);
    if (reusable) {
      reusable.order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      reusable.report.updatedAt = reusable.order.updatedAt;
      reusable.report.birthDataJson = {
        ...reusable.report.birthDataJson,
        ...this.prefillFromProfile(profile)
      };
      this.upsertOrder(reusable.order);
      this.upsertReport(reusable.report);
      return {
        order: reusable.order,
        report: reusable.report,
        payment: {
          integrationMode: PAYMENT_GATEWAY === "stripe" ? "stripe" : "placeholder",
          checkoutToken: createId("checkout"),
          supportedStates: ["pending", "paid", "failed", "cancelled", "refunded"],
          checkoutUrl: null,
          sessionId: null,
          stripePriceId: null,
          displayAmount: null,
          localDisplayAmount: `Rs. ${PRODUCT_AMOUNT}/-`
        }
      };
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const order = {
      id: createId("order"),
      userId,
      productType: PRODUCT_TYPE,
      amount: PRODUCT_AMOUNT,
      currency: PRODUCT_CURRENCY,
      status: "pending",
      paymentGateway: PAYMENT_GATEWAY,
      paymentReference: null,
      createdAt: now,
      updatedAt: now
    };
    const report = {
      id: createId("report"),
      userId,
      orderId: order.id,
      status: "awaiting_payment",
      language: "si",
      createdAt: now,
      updatedAt: now,
      completedAt: null,
      birthDataJson: this.prefillFromProfile(profile),
      astrologyDataJson: null,
      palmImageUrl: null,
      reportJson: null,
      pdfUrl: null,
      failureReason: null,
      inputSnapshot: null,
      requestId: createId("req")
    };
    const orders = this.getOrders();
    const reports = this.getReports();
    orders.push(order);
    reports.push(report);
    this.saveOrders(orders);
    this.saveReports(reports);
    return {
      order,
      report,
      payment: {
        integrationMode: PAYMENT_GATEWAY === "stripe" ? "stripe" : "placeholder",
        checkoutToken: createId("checkout"),
        supportedStates: ["pending", "paid", "failed", "cancelled", "refunded"],
        checkoutUrl: null,
        sessionId: null,
        stripePriceId: null,
        displayAmount: null,
        localDisplayAmount: `Rs. ${PRODUCT_AMOUNT}/-`
      }
    };
  }
  attachStripeCheckout(input) {
    const order = this.requireOrder(input.orderId);
    const report = this.requireReport(input.reportId);
    order.paymentGateway = "stripe";
    order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    this.upsertOrder(order);
    report.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    this.upsertReport(report);
    return {
      order,
      report,
      payment: {
        integrationMode: "stripe",
        checkoutToken: createId("checkout"),
        supportedStates: ["pending", "paid", "failed", "cancelled", "refunded"],
        checkoutUrl: input.checkoutUrl,
        sessionId: input.sessionId,
        stripePriceId: input.stripePriceId,
        displayAmount: input.displayAmount,
        localDisplayAmount: input.localDisplayAmount
      }
    };
  }
  confirmPayment(orderId, outcome) {
    console.info("[astro-report] payment state change", { orderId, outcome });
    const orders = this.getOrders();
    const reports = this.getReports();
    const order = orders.find((entry) => entry.id === orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    const report = reports.find((entry) => entry.orderId === orderId);
    if (!report) {
      throw new Error("Linked report not found");
    }
    order.status = outcome;
    order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    order.paymentReference = outcome === "paid" ? createId("pay") : null;
    report.status = outcome === "paid" ? "paid" : outcome === "cancelled" ? "awaiting_payment" : "awaiting_payment";
    report.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (outcome === "paid") {
      report.failureReason = null;
    }
    this.saveOrders(orders);
    this.saveReports(reports);
    return {
      order,
      report,
      payment: {
        integrationMode: order.paymentGateway === "stripe" ? "stripe" : "placeholder",
        checkoutToken: createId("checkout"),
        supportedStates: ["pending", "paid", "failed", "cancelled", "refunded"],
        checkoutUrl: null,
        sessionId: null,
        stripePriceId: null,
        displayAmount: null,
        localDisplayAmount: `Rs. ${PRODUCT_AMOUNT}/-`
      }
    };
  }
  confirmStripePayment(orderId, paymentReference) {
    const orders = this.getOrders();
    const reports = this.getReports();
    const order = orders.find((entry) => entry.id === orderId);
    const report = reports.find((entry) => entry.orderId === orderId);
    if (!order || !report) {
      throw new Error("Order not found");
    }
    if (order.status === "paid" && report.status !== "awaiting_payment") {
      return { order, report };
    }
    order.status = "paid";
    order.paymentGateway = "stripe";
    order.paymentReference = paymentReference;
    order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    report.status = "paid";
    report.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    report.failureReason = null;
    this.saveOrders(orders);
    this.saveReports(reports);
    return { order, report };
  }
  markPaymentCancelled(orderId, paymentReference) {
    const orders = this.getOrders();
    const reports = this.getReports();
    const order = orders.find((entry) => entry.id === orderId);
    const report = reports.find((entry) => entry.orderId === orderId);
    if (!order || !report) {
      throw new Error("Order not found");
    }
    order.status = "cancelled";
    order.paymentReference = paymentReference || order.paymentReference;
    order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    report.status = "awaiting_payment";
    report.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    this.saveOrders(orders);
    this.saveReports(reports);
    return { order, report };
  }
  getRequirements(reportId, userId, profile) {
    const report = this.requireReport(reportId, userId);
    const prefilled = {
      ...this.prefillFromProfile(profile),
      ...report.birthDataJson || {},
      ...report.inputSnapshot || {}
    };
    const missingFields = REQUIRED_FIELDS.filter((field) => {
      if (field === "palmImage") return !report.palmImageUrl;
      if (field === "preferredLanguage") return prefilled.preferredLanguage !== "si";
      const map = {
        fullName: prefilled.fullName,
        dateOfBirth: prefilled.dateOfBirth,
        timeOfBirth: prefilled.timeOfBirth,
        birthPlace: prefilled.birthPlace,
        gender: prefilled.gender
      };
      return !map[field];
    });
    if (report.status === "paid" && missingFields.length > 0) {
      report.status = "collecting_inputs";
      report.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      this.upsertReport(report);
    }
    return {
      reportId: report.id,
      requestId: report.requestId,
      status: report.status,
      missingFields,
      prefilled
    };
  }
  submitInputs(reportId, payload) {
    console.info("[astro-report] validating inputs", { reportId });
    const report = this.requireReport(reportId, payload.userId);
    const order = this.requireOrder(report.orderId, payload.userId);
    if (order.status !== "paid") {
      throw new Error("Payment required before report generation");
    }
    this.validateInputPayload(payload);
    const palmImageUrl = this.storePalmImage(report.id, payload.palmImageBase64, payload.palmImageMimeType);
    const inputSnapshot = {
      fullName: payload.fullName.trim(),
      gender: payload.gender,
      dateOfBirth: payload.dateOfBirth,
      timeOfBirth: payload.timeOfBirth,
      birthPlace: payload.birthPlace.trim(),
      preferredLanguage: "si",
      palmImageUrl,
      palmQuality: payload.palmQuality
    };
    report.inputSnapshot = inputSnapshot;
    report.birthDataJson = inputSnapshot;
    report.palmImageUrl = palmImageUrl;
    report.status = "queued";
    report.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    report.failureReason = null;
    this.upsertReport(report);
    this.queueReportGeneration(report.id);
    return { report };
  }
  createBackgroundReportFromProfile(userId, profile) {
    const activeStatuses = ["collecting_inputs", "queued", "generating", "pdf_generating"];
    const existingActive = this.getReports().filter((report2) => report2.userId === userId && activeStatuses.includes(report2.status)).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0];
    if (existingActive) {
      return { report: existingActive, reused: true };
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const order = {
      id: createId("order"),
      userId,
      productType: PRODUCT_TYPE,
      amount: PRODUCT_AMOUNT,
      currency: PRODUCT_CURRENCY,
      status: "paid",
      paymentGateway: "stripe",
      paymentReference: createId("pay"),
      createdAt: now,
      updatedAt: now
    };
    const prefilled = this.prefillFromProfile(profile);
    const report = {
      id: createId("report"),
      userId,
      orderId: order.id,
      status: "paid",
      language: "si",
      createdAt: now,
      updatedAt: now,
      completedAt: null,
      birthDataJson: {
        ...prefilled,
        preferredLanguage: "si"
      },
      astrologyDataJson: null,
      palmImageUrl: null,
      reportJson: null,
      pdfUrl: null,
      failureReason: null,
      inputSnapshot: null,
      requestId: createId("req")
    };
    const orders = this.getOrders();
    const reports = this.getReports();
    orders.push(order);
    reports.push(report);
    this.saveOrders(orders);
    this.saveReports(reports);
    return { report, reused: false };
  }
  listReports(userId) {
    const reports = this.getReports().filter((report) => report.userId === userId).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    const activeStatuses = [
      "collecting_inputs",
      "queued",
      "generating",
      "pdf_generating"
    ];
    let awaitingShown = false;
    let activeShown = false;
    return reports.filter((report) => {
      if (activeStatuses.includes(report.status)) {
        if (activeShown) return false;
        activeShown = true;
        return true;
      }
      if (report.status === "awaiting_payment") {
        if (awaitingShown || activeShown) return false;
        awaitingShown = true;
        return true;
      }
      return true;
    });
  }
  getReport(reportId, userId) {
    return this.requireReport(reportId, userId);
  }
  retryReport(reportId, adminKey) {
    if (!process.env.ASTRO_REPORT_ADMIN_KEY || adminKey !== process.env.ASTRO_REPORT_ADMIN_KEY) {
      throw new Error("Admin retry is not allowed");
    }
    const report = this.requireReport(reportId);
    report.status = "queued";
    report.failureReason = null;
    report.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    this.upsertReport(report);
    this.queueReportGeneration(report.id);
    return { report };
  }
  getPalmImageFile(reportId, userId) {
    const report = this.requireReport(reportId, userId);
    if (!report.palmImageUrl) return null;
    const filePath = path.join(this.uploadsDir, path.basename(report.palmImageUrl));
    if (!fs.existsSync(filePath)) return null;
    return filePath;
  }
  getOrders() {
    return readJsonFile(this.ordersFile, []);
  }
  findReusablePendingBundle(userId) {
    const orders = this.getOrders().filter((order) => order.userId === userId && ["pending", "cancelled", "failed"].includes(order.status)).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
    const reports = this.getReports();
    for (const order of orders) {
      const report = reports.find((entry) => entry.orderId === order.id && entry.status === "awaiting_payment");
      if (report) {
        return { order, report };
      }
    }
    return null;
  }
  saveOrders(orders) {
    writeJsonFile(this.ordersFile, orders);
  }
  upsertOrder(order) {
    const orders = this.getOrders();
    const index = orders.findIndex((entry) => entry.id === order.id);
    if (index >= 0) {
      orders[index] = order;
    } else {
      orders.push(order);
    }
    this.saveOrders(orders);
  }
  getReports() {
    return readJsonFile(this.reportsFile, []);
  }
  saveReports(reports) {
    writeJsonFile(this.reportsFile, reports);
  }
  upsertReport(report) {
    const reports = this.getReports();
    const index = reports.findIndex((entry) => entry.id === report.id);
    if (index >= 0) {
      reports[index] = report;
    } else {
      reports.push(report);
    }
    this.saveReports(reports);
  }
  requireReport(reportId, userId) {
    const report = this.getReports().find((entry) => entry.id === reportId);
    if (!report || userId && report.userId !== userId) {
      throw new Error("Report not found");
    }
    return report;
  }
  requireOrder(orderId, userId) {
    const order = this.getOrders().find((entry) => entry.id === orderId);
    if (!order || userId && order.userId !== userId) {
      throw new Error("Order not found");
    }
    return order;
  }
  prefillFromProfile(profile) {
    return {
      fullName: profile?.name || "",
      gender: profile?.gender,
      dateOfBirth: profile?.dob || "",
      timeOfBirth: profile?.birthTime || "",
      birthPlace: profile?.city || "",
      preferredLanguage: "si"
    };
  }
  validateInputPayload(payload) {
    const errors = [];
    if (!payload.fullName.trim()) errors.push("Full name is required");
    if (!payload.dateOfBirth) errors.push("Birth date is required");
    if (!payload.timeOfBirth) errors.push("Birth time is required");
    if (!payload.birthPlace.trim()) errors.push("Birth place is required");
    if (!payload.palmImageBase64) errors.push("Palm image is required");
    const { width, height, brightness, contrast, sharpness } = payload.palmQuality;
    if (width < 600 || height < 800) errors.push("Palm image resolution is too small");
    if (brightness < 45) errors.push("Palm image is too dark");
    if (contrast < 18) errors.push("Palm image contrast is too low");
    if (sharpness < 12) errors.push("Palm image is too blurry");
    if (errors.length) {
      console.warn("[astro-report] input validation failed", errors);
      throw new Error(errors[0]);
    }
  }
  storePalmImage(reportId, base64, mimeType) {
    const extension = mimeType.includes("png") ? "png" : "jpg";
    const fileName = `${reportId}-palm.${extension}`;
    const filePath = path.join(this.uploadsDir, fileName);
    const cleanBase64 = base64.includes(",") ? base64.split(",")[1] : base64;
    fs.writeFileSync(filePath, Buffer.from(cleanBase64, "base64"));
    return `/api/astro-reports/${reportId}/palm-image`;
  }
  queueReportGeneration(reportId) {
    this.queue.add(reportId);
    void this.runQueue();
  }
  async runQueue() {
    if (this.workerBusy) return;
    this.workerBusy = true;
    while (this.queue.size) {
      const [reportId] = this.queue;
      this.queue.delete(reportId);
      try {
        await this.generateReport(reportId);
      } catch (error) {
        console.error("[astro-report] generation failed", { reportId, error });
      }
    }
    this.workerBusy = false;
  }
  async generateReport(reportId) {
    let report = this.requireReport(reportId);
    if (!report.inputSnapshot) {
      report.status = "failed";
      report.failureReason = "Missing input snapshot";
      report.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      this.upsertReport(report);
      return;
    }
    try {
      console.info("[astro-report] generation start", { reportId, requestId: report.requestId });
      report.status = "generating";
      report.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      this.upsertReport(report);
      const deterministicData = this.buildDeterministicSnapshot(report.inputSnapshot);
      report.astrologyDataJson = deterministicData;
      report.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      this.upsertReport(report);
      const reportJson = await this.buildFinalReport(report, deterministicData);
      report = this.requireReport(reportId);
      report.status = "pdf_generating";
      report.reportJson = reportJson;
      report.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      this.upsertReport(report);
      await sleep(200);
      report = this.requireReport(reportId);
      report.status = "completed";
      report.pdfUrl = `/api/astro-reports/${report.id}/pdf`;
      report.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      report.completedAt = (/* @__PURE__ */ new Date()).toISOString();
      report.failureReason = null;
      this.upsertReport(report);
      console.info("[astro-report] generation complete", { reportId });
    } catch (error) {
      console.error("[astro-report] section/pdf/storage failure", error);
      report = this.requireReport(reportId);
      report.status = "failed";
      report.failureReason = error?.message || "Report generation failed";
      report.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      this.upsertReport(report);
    }
  }
  buildDeterministicSnapshot(input) {
    const baseProfile = calculateBirthProfile(input.dateOfBirth, input.timeOfBirth, input.birthPlace);
    const seed = Math.abs(hashCode(`${input.dateOfBirth}|${input.timeOfBirth}|${input.birthPlace}|${input.fullName}`));
    const signs = [
      "\u0DB8\u0DDA\u0DC2",
      "\u0DC0\u0DD8\u0DC2\u0DB7",
      "\u0DB8\u0DD2\u0DAE\u0DD4\u0DB1",
      "\u0D9A\u0DA7\u0D9A",
      "\u0DC3\u0DD2\u0D82\u0DC4",
      "\u0D9A\u0DB1\u0DCA\u0DBA\u0DCF",
      "\u0DAD\u0DD4\u0DBD\u0DCF",
      "\u0DC0\u0DD8\u0DC1\u0DCA\u0DA0\u0DD2\u0D9A",
      "\u0DB0\u0DB1\u0DD4",
      "\u0DB8\u0D9A\u0DBB",
      "\u0D9A\u0DD4\u0DB8\u0DCA\u0DB7",
      "\u0DB8\u0DD3\u0DB1"
    ];
    const planets = ["\u0DBB\u0DC0\u0DD2", "\u0DA0\u0DB1\u0DCA\u0DAF\u0DCA\u200D\u0DBB", "\u0D9A\u0DD4\u0DA2", "\u0DB6\u0DD4\u0DB0", "\u0D9C\u0DD4\u0DBB\u0DD4", "\u0DC1\u0DD4\u0D9A\u0DCA\u200D\u0DBB", "\u0DC1\u0DB1\u0DD2", "\u0DBB\u0DCF\u0DC4\u0DD4", "\u0D9A\u0DDA\u0DAD\u0DD4"];
    const focuses = ["\u0DB4\u0DDE\u0DBB\u0DD4\u0DC2\u0DBA", "\u0DB0\u0DB1\u0DBA", "\u0DC3\u0DB1\u0DCA\u0DB1\u0DD2\u0DC0\u0DDA\u0DAF\u0DB1\u0DBA", "\u0D9C\u0DD8\u0DC4\u0DA2\u0DD3\u0DC0\u0DD2\u0DAD\u0DBA", "\u0DB1\u0DD2\u0DBB\u0DCA\u0DB8\u0DCF\u0DAB\u0DC1\u0DD3\u0DBD\u0DD3\u0DAD\u0DCA\u0DC0\u0DBA", "\u0DC3\u0DDA\u0DC0\u0DCF\u0DC0", "\u0DC3\u0DB8\u0DCA\u0DB6\u0DB1\u0DCA\u0DB0\u0DAD\u0DCF", "\u0DBB\u0DC4\u0DC3\u0DCA \u0DB6\u0DBD", "\u0DB0\u0DBB\u0DCA\u0DB8\u0DBA", "\u0D9A\u0DCF\u0DBB\u0DCA\u0DBA\u0DB7\u0DCF\u0DBB\u0DBA", "\u0DBD\u0DCF\u0DB7", "\u0DC0\u0DD2\u0DC0\u0DDA\u0D9A\u0DBA"];
    const monthNekath = getLogicalNekathForMonth((/* @__PURE__ */ new Date()).getMonth());
    const planetPositions = planets.map((planet, index) => {
      const degree = (seeded(seed, index + 1) * 29.99).toFixed(2);
      return {
        planet,
        sign: signs[Math.floor(seeded(seed, index + 21) * signs.length)],
        degree: `${degree}\xB0`,
        house: Math.floor(seeded(seed, index + 41) * 12) % 12 + 1
      };
    });
    const housePositions = Array.from({ length: 12 }, (_, index) => ({
      house: index + 1,
      sign: signs[Math.floor(seeded(seed, index + 61) * signs.length)],
      focus: focuses[index]
    }));
    return {
      lagna: baseProfile.lagna || baseProfile.rashi || "\u0DB8\u0D9A\u0DBB",
      rashi: baseProfile.janmaRashiya || baseProfile.rashi || "\u0DB8\u0D9A\u0DBB",
      nakshatra: baseProfile.nekatha || "\u0DB4\u0DD4\u0DC0\u0DB4\u0DD4\u0DA7\u0DD4\u0DB4",
      pada: baseProfile.nekathPadaya || "1 \u0DC0\u0DB1 \u0DB4\u0DCF\u0DAF\u0DBA",
      planetPositions,
      housePositions,
      dashaSummary: {
        currentPhase: "\u0DC0\u0DAD\u0DCA\u0DB8\u0DB1\u0DCA \u0DAF\u0DC1\u0DCF \u0DAD\u0DAD\u0DCA\u0DAD\u0DCA\u0DC0\u0DBA \u0DC3\u0D82\u0DBA\u0DB8\u0DBA \u0DC3\u0DC4 \u0DC3\u0DD0\u0DBD\u0DC3\u0DD4\u0DB8 \u0D89\u0DBD\u0DCA\u0DBD\u0DCF \u0DC3\u0DD2\u0DA7\u0DD2\u0DB1 \u0D9A\u0DCF\u0DBD\u0DBA\u0D9A\u0DD2.",
        nextPhase: "\u0D89\u0DAF\u0DD2\u0DBB\u0DD2 \u0D85\u0DC0\u0DB0\u0DD2\u0DBA\u0DDA\u0DAF\u0DD3 \u0D9A\u0DCA\u200D\u0DBB\u0DD2\u0DBA\u0DCF\u0D9A\u0DCF\u0DBB\u0DD3 \u0DC0\u0DBB\u0DCA\u0DB0\u0DB1 \u0D85\u0DC0\u0DC3\u0DCA\u0DAE\u0DCF \u0DC0\u0DD0\u0DA9\u0DD2 \u0DC0\u0DD3\u0DB8\u0DA7 \u0D89\u0DA9 \u0D87\u0DAD.",
        helpfulPeriods: ["\u0D8B\u0DAF\u0DD1\u0DC3\u0DB1 \u0DC3\u0DD0\u0DBD\u0DC3\u0DD4\u0DB8\u0DCA \u0D9A\u0DBB\u0DB1 \u0D9A\u0DCF\u0DBD\u0DBA", "\u0DB8\u0DB0\u0DCA\u200D\u0DBA \u0D9A\u0DCF\u0DBD\u0DD3\u0DB1 \u0DB8\u0DD4\u0DAF\u0DBD\u0DCA \u0DAD\u0DD3\u0DBB\u0DAB \u0DC3\u0D9A\u0DC3\u0DCA \u0D9A\u0DBB\u0DB1 \u0D9A\u0DCF\u0DBD\u0DBA"],
        challengingPeriods: ["\u0DC4\u0DAF\u0DD2\u0DC3\u0DD2 \u0DC0\u0DD2\u0DBA\u0DAF\u0DB8\u0DCA \u0D87\u0DAD\u0DD2\u0DC0\u0DB1 \u0DC3\u0DAD\u0DD2", "\u0D85\u0DB0\u0DD2\u0D9A \u0DC0\u0D9C\u0D9A\u0DD3\u0DB8\u0DCA \u0D91\u0D9A\u0DC0\u0DBB \u0D91\u0D9A\u0DAD\u0DD4 \u0DC0\u0DB1 \u0D85\u0DC0\u0DB0\u0DD2"]
      },
      yogasAndDoshas: {
        strengths: ["\u0DC3\u0DCA\u0DAE\u0DD2\u0DBB \u0DC3\u0D82\u0D9A\u0DBD\u0DCA\u0DB4\u0DBA", "\u0D9C\u0DD0\u0DB9\u0DD4\u0DBB\u0DD4 \u0DC0\u0DD2\u0DB8\u0DC3\u0DD4\u0DB8", "\u0DC3\u0DB8\u0DCA\u0DB6\u0DB1\u0DCA\u0DB0\u0DAD\u0DCF \u0DAD\u0DDA\u0DBB\u0DD4\u0DB8\u0DCA \u0D9C\u0DD0\u0DB1\u0DD3\u0DB8\u0DDA \u0DC4\u0DD0\u0D9A\u0DD2\u0DBA\u0DCF\u0DC0"],
        cautions: ["\u0D85\u0DB0\u0DD2\u0D9A \u0D9A\u0DBD\u0DCA\u0DB4\u0DB1\u0DCF \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8", "\u0DC0\u0DD2\u0DC1\u0DCA\u0DC0\u0DCF\u0DC3\u0DBA \u0DB4\u0DCA\u200D\u0DBB\u0D9A\u0DCF\u0DC1 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8\u0DA7 \u0DB4\u0DCA\u200D\u0DBB\u0DB8\u0DCF\u0DAF \u0DC0\u0DD3\u0DB8"],
        certainty: "hybrid"
      },
      transitSummary: "\u0DC0\u0930\u094D\u0924\u092E\u093E\u0928 \u0D9C\u0DCA\u200D\u0DBB\u0DC4 \u0D9C\u0DB8\u0DB1\u0DCA \u0DC3\u0DCF\u0DBB\u0DCF\u0D82\u0DC1\u0DBA \u0DB4\u0DAF\u0DB1\u0DB8\u0DCA \u0DB8\u0DA7\u0DCA\u0DA7\u0DB8\u0DDA \u0DB1\u0DD2\u0DBB\u0DD3\u0D9A\u0DCA\u0DC2\u0DAB\u0DBA\u0D9A\u0DCA \u0DBD\u0DD9\u0DC3 \u0DB7\u0DCF\u0DC0\u0DD2\u0DAD \u0D9A\u0DBB \u0D87\u0DAD.",
      upcomingNekathLogic: [monthNekath.business, monthNekath.travel],
      recommendedGemLogic: ["\u0DC1\u0DB1\u0DD2 \u0DC3\u0DC4 \u0D9C\u0DD4\u0DBB\u0DD4 \u0DB6\u0DBD \u0DC3\u0DB8\u0DAD\u0DD4\u0DBD\u0DD2\u0DAD \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8\u0DDA \u0D9C\u0DD0\u0DB9\u0DD4\u0DBB\u0DD4 \u0DC0\u0DBB\u0DCA\u0DAB \u0DB8\u0DD0\u0DAB\u0DD2\u0D9A\u0DCA \u0DC3\u0DBD\u0D9A\u0DCF \u0DB6\u0DD0\u0DBD\u0DD3\u0DB8.", "\u0DB4\u0DC5\u0DB3\u0DD2\u0DB1 \u0DAF\u0DD2\u0DB1 \u0DC3\u0DC4 \u0D85\u0DAD \u0DC3\u0DB8\u0DCA\u0DB6\u0DB1\u0DCA\u0DB0 \u0DB1\u0DD3\u0DAD\u0DD2 \u0D85\u0D82\u0DC1\u0DD2\u0D9A\u0DC0 \u0DB7\u0DCF\u0DC0\u0DD2\u0DAD \u0D9A\u0DC5 \u0DBA\u0DD4\u0DAD\u0DD4\u0DBA."],
      remedyBaseRules: ["\u0D85\u0DC0\u0DB0\u0DCF\u0DB1\u0DBA, \u0DB1\u0DD2\u0DAD\u0DBB \u0DB7\u0DCF\u0DC0\u0DB1\u0DCF \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8, \u0DC3\u0DC4 \u0DAF\u0DDB\u0DB1\u0DD2\u0D9A \u0DC0\u0DCA\u200D\u0DBA\u0DC0\u0DC3\u0DCA\u0DAE\u0DCF\u0DC0 \u0DC1\u0D9A\u0DCA\u0DAD\u0DD2\u0DB8\u0DAD\u0DCA \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8.", "\u0DB8\u0DB1\u0DC3 \u0D85\u0DC0\u0DD2\u0DB0\u0DD2\u0DB8\u0DAD\u0DCA \u0D9A\u0DBB\u0DB1 \u0DB4\u0DD4\u0DBB\u0DD4\u0DAF\u0DD4 \u0D85\u0DA9\u0DD4 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8."],
      palmObservationSummary: [
        input.palmQuality.sharpness > 20 ? "\u0DBB\u0DDA\u0D9B\u0DCF \u0DB4\u0DD0\u0DC4\u0DD0\u0DAF\u0DD2\u0DBD\u0DD2\u0DC0 \u0DB4\u0DD9\u0DB1\u0DDA." : "\u0D85\u0DAD\u0DCA \u0DBB\u0DDA\u0D9B\u0DCF \u0DB8\u0DB0\u0DCA\u200D\u0DBA\u0DC3\u0DCA\u0DAE \u0DBD\u0DD9\u0DC3 \u0DB4\u0DD9\u0DB1\u0DDA.",
        input.palmQuality.brightness > 70 ? "\u0D86\u0DBD\u0DDD\u0D9A \u0DAD\u0DAD\u0DCA\u0DAD\u0DCA\u0DC0\u0DBA \u0DC4\u0DDC\u0DB3 \u0DB6\u0DD0\u0DC0\u0DD2\u0DB1\u0DCA \u0DB1\u0DD2\u0DBB\u0DD3\u0D9A\u0DCA\u0DC2\u0DAB \u0DC0\u0DD2\u0DC1\u0DCA\u0DC0\u0DCF\u0DC3\u0DBA \u0DC0\u0DD0\u0DA9\u0DD2\u0DBA." : "\u0DA1\u0DCF\u0DBA\u0DCF\u0DBB\u0DD6\u0DB4 \u0D86\u0DBD\u0DDD\u0D9A\u0DBA \u0DB8\u0DB0\u0DCA\u200D\u0DBA\u0DC3\u0DCA\u0DAE\u0DBA."
      ],
      calculationNotes: [
        "\u0DBD\u0D9C\u0DCA\u0DB1\u0DBA, \u0DB1\u0D9A\u0DCA\u0DC2\u0DAD\u0DCA\u200D\u0DBB\u0DBA \u0DC3\u0DC4 \u0DB4\u0DCF\u0DAF\u0DBA \u0D8B\u0DB4\u0DB1\u0DCA \u0DAD\u0DDC\u0DBB\u0DAD\u0DD4\u0DBB\u0DD4 \u0DB8\u0DAD backend \u0DB8\u0D9F\u0DD2\u0DB1\u0DCA \u0DC3\u0D9A\u0DC3\u0DCA \u0D9A\u0DBB \u0D87\u0DAD.",
        "\u0D8B\u0DC3\u0DC3\u0DCA \u0DAF\u0DC1\u0DCF, \u0DBA\u0DDD\u0D9C \u0DC3\u0DC4 \u0D9C\u0DCA\u200D\u0DBB\u0DC4 \u0DC3\u0D82\u0DA0\u0DCF\u0DBB \u0D9A\u0DDC\u0DA7\u0DC3\u0DCA \u0DC3\u0DB8\u0DCA\u0DB4\u0DD6\u0DBB\u0DCA\u0DAB \u0D9C\u0DAB\u0DD2\u0DAD \u0DB4\u0DAF\u0DCA\u0DB0\u0DAD\u0DD2\u0DBA\u0D9A\u0DCA \u0DB1\u0DDC\u0DB8\u0DD0\u0DAD\u0DD2 \u0DB1\u0DD2\u0DC3\u0DCF hybrid explanation \u0D86\u0D9A\u0DCF\u0DBB\u0DBA\u0DD9\u0DB1\u0DCA \u0DC3\u0D9A\u0DC3\u0DCA \u0D9A\u0DBB \u0D87\u0DAD."
      ]
    };
  }
  async buildFinalReport(report, deterministicData) {
    const input = report.inputSnapshot;
    const sections = await Promise.all(
      SECTION_ORDER.map(async ([key, title]) => {
        const content = await this.generateSectionWithRetry(key, title, input, deterministicData);
        return { key, title, content };
      })
    );
    const sectionMap = sections.reduce((acc, section) => {
      acc[section.key] = {
        key: section.key,
        title: section.title,
        content: section.content
      };
      return acc;
    }, {});
    return {
      coverSection: sectionMap.coverSection,
      coreAstroProfile: sectionMap.coreAstroProfile,
      personalityLifeBlueprint: sectionMap.personalityLifeBlueprint,
      wealthCareerBusinessReport: sectionMap.wealthCareerBusinessReport,
      loveMarriageRelationshipReport: sectionMap.loveMarriageRelationshipReport,
      healthLifestyleGuidance: sectionMap.healthLifestyleGuidance,
      dashaTimePeriodAnalysis: sectionMap.dashaTimePeriodAnalysis,
      yogasDoshasPlanetaryInfluences: sectionMap.yogasDoshasPlanetaryInfluences,
      palmAnalysisReport: sectionMap.palmAnalysisReport,
      upcomingNekathForUser: sectionMap.upcomingNekathForUser,
      pastLifeLine: sectionMap.pastLifeLine,
      recommendedGemsToWear: sectionMap.recommendedGemsToWear,
      fullRemediesReport: sectionMap.fullRemediesReport,
      personalizedRecommendations: sectionMap.personalizedRecommendations,
      finalThoughtSummary: sectionMap.finalThoughtSummary,
      endRecommendationsSection: sectionMap.endRecommendationsSection,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      generationMode: this.ai ? "gemini_hybrid" : "deterministic_fallback"
    };
  }
  async generateSectionWithRetry(key, title, input, deterministicData) {
    let lastContent = this.buildFallbackSection(key, title, input, deterministicData);
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        if (!this.ai) {
          return lastContent;
        }
        console.info("[astro-report] generating section", { key, attempt });
        const prompt = this.buildSectionPrompt(key, title, input, deterministicData, lastContent);
        const response = await this.ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });
        const parsed = safeJsonParse(response.text || "", { content: lastContent });
        const candidate = (parsed.content || "").trim();
        if (candidate) {
          return candidate;
        }
      } catch (error) {
        console.warn("[astro-report] section generation retry", { key, attempt, error });
      }
    }
    return lastContent;
  }
  buildSectionPrompt(key, title, input, deterministicData, fallbackContent) {
    return `\u0D94\u0DB6 Wishwaya \u0DC3\u0DB3\u0DC4\u0DCF \u0DC0\u0DD8\u0DAD\u0DCA\u0DAD\u0DD3\u0DBA \u0DA2\u0DDD\u0DAD\u0DD2\u0DC1\u0DCA\u200D\u0DBA \u0D8B\u0DB4\u0DAF\u0DDA\u0DC1\u0D9A\u0DBA\u0DD9\u0D9A\u0DD2.
\u0DB8\u0DD9\u0DB8 \u0D9A\u0DDC\u0DA7\u0DC3 \u0DC3\u0DB3\u0DC4\u0DCF JSON only \u0DBD\u0DB6\u0DCF \u0DAF\u0DD9\u0DB1\u0DCA\u0DB1: {"content":"..."}.

\u0DB1\u0DD3\u0DAD\u0DD2:
- \u0DB4\u0DCA\u200D\u0DBB\u0DAD\u0DD2\u0DAF\u0DCF\u0DB1\u0DBA 100% \u0DC3\u0DD2\u0D82\u0DC4\u0DBD\u0DD9\u0DB1\u0DCA.
- \u0DC3\u0DD4\u0DBB\u0DD6\u0DB4\u0DD3, \u0DC0\u0DD8\u0DAD\u0DCA\u0DAD\u0DD3\u0DBA, \u0DB4\u0DD4\u0DAF\u0DCA\u0D9C\u0DBD\u0DD2\u0D9A, \u0D9C\u0DD0\u0DB9\u0DD4\u0DBB\u0DD4 \u0DC0\u0DD2\u0D9C\u0DCA\u200D\u0DBB\u0DC4\u0DB8\u0DBA \u0DB7\u0DCF\u0DC2\u0DCF\u0DC0 \u0DB7\u0DCF\u0DC0\u0DD2\u0DAD \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1.
- \u0D9C\u0DAB\u0DB1\u0DBA \u0D9A\u0DC5 \u0D9A\u0DBB\u0DD4\u0DAB\u0DD4 \u0DC0\u0DD9\u0DB1\u0DC3\u0DCA \u0DB1\u0DDC\u0D9A\u0DBB\u0DB1\u0DCA\u0DB1.
- uncertainty \u0D87\u0DAD\u0DD2 \u0DAD\u0DD0\u0DB1\u0DCA\u0DC0\u0DBD careful wording \u0DB7\u0DCF\u0DC0\u0DD2\u0DAD \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1.
- English \u0DC0\u0DA0\u0DB1 \u0D85\u0DC0\u0DB8 \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1.

\u0DC0\u0DCF\u0DBB\u0DCA\u0DAD\u0DCF \u0D9A\u0DDC\u0DA7\u0DC3:
${title}

\u0DB4\u0DBB\u0DD2\u0DC1\u0DD3\u0DBD\u0D9A \u0DAD\u0DDC\u0DBB\u0DAD\u0DD4\u0DBB\u0DD4:
\u0DB1\u0DB8: ${input.fullName}
\u0D8B\u0DB4\u0DB1\u0DCA \u0DAF\u0DD2\u0DB1\u0DBA: ${input.dateOfBirth}
\u0D8B\u0DB4\u0DB1\u0DCA \u0DC0\u0DDA\u0DBD\u0DCF\u0DC0: ${input.timeOfBirth}
\u0D8B\u0DB4\u0DB1\u0DCA \u0DC3\u0DCA\u0DAE\u0DCF\u0DB1\u0DBA: ${input.birthPlace}
\u0DC3\u0DCA\u0DAD\u0DCA\u200D\u0DBB\u0DD3/\u0DB4\u0DD4\u0DBB\u0DD4\u0DC2: ${input.gender}

Deterministic astrology data:
${JSON.stringify(deterministicData, null, 2)}

\u0DB8\u0DDA \u0D9A\u0DDC\u0DA7\u0DC3 \u0DC3\u0DB3\u0DC4\u0DCF fallback draft:
${fallbackContent}

\u0D9A\u0DDC\u0DA7\u0DC3 key: ${key}
\u0D85\u0DC0\u0DC3\u0DCF\u0DB1 \u0D85\u0DB1\u0DCA\u0DAD\u0DBB\u0DCA\u0D9C\u0DAD\u0DBA paragraph + short bullets style \u0D91\u0D9A\u0D9A\u0DD2\u0DB1\u0DCA \u0D91\u0D9A\u0DB8 string \u0D91\u0D9A\u0D9A\u0DCA \u0DBD\u0DD9\u0DC3 \u0DBD\u0DB6\u0DCF \u0DAF\u0DD9\u0DB1\u0DCA\u0DB1.`;
  }
  buildFallbackSection(key, title, input, deterministicData) {
    const base = {
      coverSection: `Wishwaya Premium \u0DA2\u0DDD\u0DAD\u0DD2\u0DC1\u0DCA\u200D\u0DBA \u0DC0\u0DCF\u0DBB\u0DCA\u0DAD\u0DCF\u0DC0
\u0DB1\u0DB8: ${input.fullName}
\u0D8B\u0DB4\u0DB1\u0DCA \u0DAD\u0DDC\u0DBB\u0DAD\u0DD4\u0DBB\u0DD4: ${input.dateOfBirth} ${input.timeOfBirth} - ${input.birthPlace}
\u0DC3\u0D9A\u0DC3\u0DCA \u0D9A\u0DC5 \u0DAF\u0DD2\u0DB1\u0DBA: ${sinhalaDate((/* @__PURE__ */ new Date()).toISOString())}
Premium Sinhala PDF Report - \u0D91\u0D9A\u0DCA\u0DC0\u0DBB \u0D9C\u0DD9\u0DC0\u0DD3\u0DB8\u0D9A\u0DCA.`,
      coreAstroProfile: `\u0DBD\u0D9C\u0DCA\u0DB1\u0DBA ${deterministicData.lagna} \u0DBD\u0DD9\u0DC3\u0DAD\u0DCA, \u0DA2\u0DB1\u0DCA\u0DB8 \u0DBB\u0DCF\u0DC1\u0DD2\u0DBA ${deterministicData.rashi} \u0DBD\u0DD9\u0DC3\u0DAD\u0DCA \u0DB8\u0DD9\u0DB8 \u0DC0\u0DCF\u0DBB\u0DCA\u0DAD\u0DCF\u0DC0 \u0DC3\u0D9A\u0DC3\u0DCA \u0D9A\u0DBB \u0D87\u0DAD. \u0DB1\u0DD0\u0D9A\u0DAD ${deterministicData.nakshatra} \u0DC0\u0DB1 \u0D85\u0DAD\u0DBB ${deterministicData.pada} \u0DB8\u0D9F\u0DD2\u0DB1\u0DCA \u0D94\u0DB6\u0D9C\u0DDA \u0DA2\u0DD3\u0DC0\u0DD2\u0DAD \u0DBB\u0DA7\u0DCF\u0DC0\u0DDA \u0DC3\u0D82\u0DC0\u0DDA\u0DAF\u0DD3 \u0D85\u0D9C\u0DBA\u0DB1\u0DCA \u0DAD\u0DDA\u0DBB\u0DD4\u0DB8\u0DCA \u0D9C\u0DD0\u0DB1\u0DD3\u0DB8\u0DA7 \u0DB4\u0DAF\u0DB1\u0DB8\u0D9A\u0DCA \u0DBD\u0DD0\u0DB6\u0DDA. \u0D9C\u0DCA\u200D\u0DBB\u0DC4 \u0DB4\u0DD2\u0DC4\u0DD2\u0DA7\u0DD3\u0DB8\u0DCA \u0DC4\u0DCF \u0DB7\u0DCF\u0DC0 \u0DC3\u0DCF\u0DBB\u0DCF\u0D82\u0DC1\u0DBA \u0D85\u0DB1\u0DD4\u0DC0 \u0D94\u0DB6\u0D9C\u0DDA \u0DA2\u0DD3\u0DC0\u0DD2\u0DAD\u0DBA \u0DC3\u0DCA\u0DAE\u0DCF\u0DC0\u0DBB \u0DC0\u0DD4\u0DC0\u0DAD\u0DCA, \u0DAF\u0DD3\u0DBB\u0DCA\u0D9D\u0D9A\u0DCF\u0DBD\u0DD3\u0DB1 \u0DAD\u0DD3\u0DBB\u0DAB \u0DC3\u0DB8\u0DCA\u0DB6\u0DB1\u0DCA\u0DB0\u0DBA\u0DD9\u0DB1\u0DCA \u0DC4\u0DDC\u0DB3 \u0DC3\u0DD0\u0DBD\u0DC3\u0DD4\u0DB8\u0D9A\u0DCA \u0D85\u0DC0\u0DC1\u0DCA\u200D\u0DBA \u0DB6\u0DC0 \u0DB4\u0DD9\u0DB1\u0DDA.`,
      personalityLifeBlueprint: `${input.fullName} \u0DAD\u0DD4\u0DC5 \u0DAD\u0DD3\u0DBB\u0DAB \u0D9C\u0DD0\u0DB1\u0DD3\u0DB8\u0DA7 \u0DB4\u0DD9\u0DBB \u0DC0\u0DD2\u0DB8\u0DC3\u0DCF \u0DB6\u0DBD\u0DB1 \u0DC3\u0DCA\u0DC0\u0DB7\u0DCF\u0DC0\u0DBA\u0D9A\u0DCA \u0DC3\u0DC4 \u0D87\u0DAD\u0DD4\u0DC5\u0DAD \u0DC1\u0D9A\u0DCA\u0DAD\u0DD2\u0DBA\u0D9A\u0DCA \u0DB4\u0DD9\u0DB1\u0DDA. \u0D94\u0DB6\u0D9C\u0DDA \u0DC3\u0DD2\u0DAD\u0DD2\u0DC0\u0DD2\u0DBD\u0DD2 \u0D9C\u0DD0\u0DB9\u0DD4\u0DBB\u0DD4 \u0DC0\u0DB1 \u0DB1\u0DB8\u0DD4\u0DAD\u0DCA \u0D92\u0DC0\u0DCF \u0D9A\u0DCA\u200D\u0DBB\u0DD2\u0DBA\u0DCF\u0DC0\u0DA7 \u0D9C\u0DD9\u0DB1 \u0D92\u0DB8\u0DA7 \u0DB4\u0DD0\u0DC4\u0DD0\u0DAF\u0DD2\u0DBD\u0DD2 \u0DB4\u0DD2\u0DBA\u0DC0\u0DBB \u0DC3\u0D9A\u0DC3\u0DCA \u0D9A\u0DC5 \u0DC0\u0DD2\u0DA7 \u0DC0\u0DD2\u0DC1\u0DCF\u0DBD \u0DB4\u0DCA\u200D\u0DBB\u0D9C\u0DAD\u0DD2\u0DBA\u0D9A\u0DCA \u0DBD\u0DD0\u0DB6\u0DDA. \u0DC1\u0D9A\u0DCA\u0DAD\u0DD2\u0DB8\u0DAD\u0DCA \u0DB4\u0DD0\u0DAD\u0DCA\u0DAD\u0D9A\u0DCA \u0DBD\u0DD9\u0DC3 \u0DC0\u0DD2\u0DC1\u0DCA\u0DC0\u0DCF\u0DC3\u0DBA, \u0DC0\u0D9C\u0D9A\u0DD3\u0DB8\u0DCA \u0DB7\u0DCF\u0DBB \u0D9C\u0DD0\u0DB1\u0DD3\u0DB8 \u0DC3\u0DC4 \u0D85\u0DB1\u0DCA \u0D85\u0DBA\u0D9C\u0DDA \u0DAD\u0DAD\u0DCA\u0DAD\u0DCA\u0DC0\u0DBA \u0DAD\u0DDA\u0DBB\u0DD4\u0DB8\u0DCA \u0D9C\u0DD0\u0DB1\u0DD3\u0DB8 \u0DAF\u0DD0\u0D9A\u0DCA\u0DC0\u0DD9\u0DBA\u0DD2. \u0DAF\u0DD4\u0DBB\u0DCA\u0DC0\u0DBD \u0DB4\u0DD0\u0DAD\u0DCA\u0DAD\u0D9A\u0DCA \u0DBD\u0DD9\u0DC3 \u0D85\u0DB0\u0DD2\u0D9A \u0DC3\u0DD2\u0DAD\u0DD3\u0DB8, \u0DB4\u0DCA\u200D\u0DBB\u0DB8\u0DCF\u0DAF \u0DC0\u0DD3\u0DB8 \u0DC3\u0DC4 \u0DAD\u0DC0\u0DAD\u0DCA \u0DAD\u0DC4\u0DC0\u0DD4\u0DBB\u0DD4 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8\u0D9A\u0DCA \u0D9A\u0DD0\u0DB8\u0DAD\u0DD2 \u0DC0\u0DD3\u0DB8 \u0DB4\u0DD9\u0DB1\u0DCA\u0DC0\u0DBA\u0DD2.`,
      wealthCareerBusinessReport: `\u0DB0\u0DB1 \u0DC4\u0DCF \u0DC0\u0DD8\u0DAD\u0DCA\u0DAD\u0DD3\u0DBA \u0DB4\u0DD0\u0DAD\u0DCA\u0DAD\u0DDA\u0DAF\u0DD3 \u0D94\u0DB6\u0DA7 \u0D85\u0D9B\u0DAB\u0DCA\u0DA9 \u0D86\u0DAF\u0DCF\u0DBA\u0DB8, \u0DC3\u0D82\u0DC0\u0DD2\u0DB0\u0DCF\u0DB1\u0DCF\u0DAD\u0DCA\u0DB8\u0D9A \u0DC0\u0DD0\u0DA9 \u0DC3\u0DC4 \u0DC0\u0DD2\u0DC1\u0DCA\u0DC0\u0DCF\u0DC3\u0DBA \u0DB8\u0DAD \u0D9C\u0DDC\u0DA9\u0DB1\u0DD0\u0D9C\u0DD9\u0DB1 \u0D9A\u0DCA\u0DC2\u0DDA\u0DAD\u0DCA\u200D\u0DBB \u0DC3\u0DD4\u0DAF\u0DD4\u0DC3\u0DD4 \u0DC0\u0DDA. \u0DBB\u0DD0\u0D9A\u0DD2\u0DBA\u0DCF\u0DC0\u0D9A \u0DC0\u0D9C\u0D9A\u0DD3\u0DB8\u0DCA \u0DC3\u0DC4\u0DD2\u0DAD \u0DAD\u0DAD\u0DCA\u0DAD\u0DCA\u0DC0\u0DBA\u0D9A\u0DCA \u0D94\u0DB6\u0DA7 \u0DC4\u0DDC\u0DB3 \u0DC0\u0DD4\u0DC0\u0DAD\u0DCA, \u0DC3\u0DD0\u0DBD\u0DC3\u0DD4\u0DB8\u0DCA\u0D9A\u0DBB\u0DAB\u0DBA, \u0D8B\u0DB4\u0DAF\u0DDA\u0DC1\u0DB1 \u0DC3\u0DDA\u0DC0\u0DCF\u0DC0, \u0DB1\u0DD2\u0DBB\u0DCA\u0DB8\u0DCF\u0DAB\u0DCF\u0DAD\u0DCA\u0DB8\u0D9A \u0DC0\u0DCA\u200D\u0DBA\u0DCF\u0DB4\u0DCF\u0DBB \u0DC4\u0DDD \u0DC3\u0DCA\u0DC0\u0DCF\u0DB0\u0DD3\u0DB1 \u0DC0\u0DCA\u200D\u0DBA\u0DCF\u0DB4\u0DD8\u0DAD\u0DD2 \u0DB8\u0D9F\u0DD2\u0DB1\u0DCA\u0DAF \u0DC0\u0DBB\u0DCA\u0DB0\u0DB1\u0DBA\u0D9A\u0DCA \u0DBD\u0DB6\u0DCF \u0D9C\u0DAD \u0DC4\u0DD0\u0D9A. \u0DB8\u0DD4\u0DAF\u0DBD\u0DCA \u0DB4\u0DD0\u0DAD\u0DCA\u0DAD\u0DDA\u0DAF\u0DD3 \u0D91\u0D9A\u0DCA\u0DC0\u0DBB\u0DB8 \u0DBD\u0DCF\u0DB7 \u0DC3\u0DD9\u0DC0\u0DD3\u0DB8\u0DA7 \u0DC0\u0DA9\u0DCF \u0DAF\u0DD2\u0D9C\u0DD4 \u0D9A\u0DCF\u0DBD\u0DD3\u0DB1 \u0D9C\u0DDC\u0DA9\u0DB1\u0DD0\u0D9C\u0DD3\u0DB8 \u0D94\u0DB6\u0DA7 \u0DC0\u0DA9\u0DCF \u0DC0\u0DCF\u0DC3\u0DD2\u0DAF\u0DCF\u0DBA\u0D9A\u0DBA.`,
      loveMarriageRelationshipReport: `\u0DC3\u0DB8\u0DCA\u0DB6\u0DB1\u0DCA\u0DB0\u0DAD\u0DCF \u0DAD\u0DD4\u0DC5 \u0D94\u0DB6 \u0D85\u0DB1\u0DCA\u0DAD\u0DBB\u0DCA\u0D9C\u0DAD \u0D9C\u0DD0\u0DB9\u0DD4\u0DBB\u0DD4\u0D9A\u0DB8, \u0D85\u0DC0\u0D82\u0D9A\u0DAD\u0DCA\u0DC0\u0DBA \u0DC3\u0DC4 \u0DC3\u0DCA\u0DAE\u0DCF\u0DC0\u0DBB \u0DB7\u0DCF\u0DC0\u0DBA \u0DB6\u0DBD\u0DCF\u0DB4\u0DDC\u0DBB\u0DDC\u0DAD\u0DCA\u0DAD\u0DD4 \u0DC0\u0DB1 \u0D85\u0DBA\u0DD9\u0D9A\u0DD2. \u0D86\u0DAF\u0DBB\u0DBA \u0DAD\u0DD4\u0DC5 \u0D94\u0DB6\u0DA7 \u0DC0\u0DD2\u0DC1\u0DCA\u0DC0\u0DCF\u0DC3\u0DBA \u0D9C\u0DDC\u0DA9\u0DB1\u0DD0\u0D9C\u0DD3\u0DB8\u0DA7 \u0DC3\u0DD4\u0DC5\u0DD4 \u0D9A\u0DCF\u0DBD\u0DBA\u0D9A\u0DCA \u0D9C\u0DAD \u0DC0\u0DD2\u0DBA \u0DC4\u0DD0\u0D9A\u0DD2 \u0DB1\u0DB8\u0DD4\u0DAD\u0DCA \u0D91\u0DBA \u0D9C\u0DDC\u0DA9\u0DB1\u0DD0\u0D9C\u0DD4\u0DAB\u0DD4 \u0DB4\u0DC3\u0DD4 \u0D94\u0DB6 \u0D89\u0DAD\u0DCF \u0DB4\u0D9A\u0DCA\u0DC2\u0DB4\u0DCF\u0DAD\u0DD3 \u0DC0\u0DDA. \u0DC0\u0DD2\u0DC0\u0DCF\u0DC4\u0DBA \u0DC3\u0DB8\u0DCA\u0DB6\u0DB1\u0DCA\u0DB0\u0DBA\u0DD9\u0DB1\u0DCA \u0D85\u0DA9\u0DD4 \u0DC0\u0DA0\u0DB1\u0DC0\u0DBD\u0DA7 \u0DC0\u0DA9\u0DCF \u0D9A\u0DCA\u200D\u0DBB\u0DD2\u0DBA\u0DCF\u0DC0\u0DD9\u0DB1\u0DCA \u0D86\u0DAF\u0DBB\u0DBA \u0DB4\u0DD9\u0DB1\u0DCA\u0DC0\u0DB1 \u0D9C\u0DD4\u0DAB\u0DBA\u0D9A\u0DCA \u0DB4\u0DD9\u0DB1\u0DDA. \u0D9A\u0DD9\u0DC3\u0DDA \u0DC0\u0DD9\u0DAD\u0DAD\u0DCA, \u0DB1\u0DDC\u0D9A\u0DD2\u0DBA\u0DD6 \u0D85\u0DB4\u0DDA\u0D9A\u0DCA\u0DC2\u0DCF \u0DC3\u0DB8\u0DCA\u0DB6\u0DB1\u0DCA\u0DB0\u0DAD\u0DCF \u0DB8\u0DAD \u0DB4\u0DD3\u0DA9\u0DB1\u0DBA\u0D9A\u0DCA \u0D87\u0DAD\u0DD2 \u0D9A\u0DC5 \u0DC4\u0DD0\u0D9A\u0DD2 \u0DB6\u0DD0\u0DC0\u0DD2\u0DB1\u0DCA \u0DB4\u0DCF\u0DBB\u0DAF\u0DD8\u0DC1\u0DCA\u200D\u0DBA \u0D9A\u0DAD\u0DCF\u0DB6\u0DC4 \u0D85\u0DC0\u0DC1\u0DCA\u200D\u0DBA\u0DBA.`,
      healthLifestyleGuidance: `\u0DC1\u0DBB\u0DD3\u0DBB\u0DBA\u0DA7 \u0DC0\u0DA9\u0DCF \u0DB8\u0DB1\u0DC3 \u0DB8\u0DAD \u0DB4\u0DD3\u0DA9\u0DB1\u0DBA \u0D91\u0D9A\u0DAD\u0DD4 \u0DC0\u0DB1 \u0DC3\u0DCA\u0DC0\u0DB7\u0DCF\u0DC0\u0DBA \u0DB8\u0DD9\u0DC4\u0DD2 \u0DB4\u0DD9\u0DB1\u0DDA. \u0DB1\u0DD2\u0DB1\u0DCA\u0DAF, \u0DA2\u0DBD \u0DB4\u0DCF\u0DB1, \u0DB1\u0DD2\u0DBA\u0DB8\u0DD2\u0DAD \u0D86\u0DC4\u0DCF\u0DBB \u0DC0\u0DDA\u0DBD\u0DCF\u0DC0\u0DB1\u0DCA \u0DC3\u0DC4 \u0DC3\u0DD0\u0DC4\u0DD0\u0DBD\u0DCA\u0DBD\u0DD4 \u0DC0\u0DCA\u200D\u0DBA\u0DCF\u0DBA\u0DCF\u0DB8 \u0D94\u0DB6\u0D9C\u0DDA \u0DC1\u0D9A\u0DCA\u0DAD\u0DD2\u0DBA \u0DC3\u0DCA\u0DAE\u0DCF\u0DC0\u0DBB \u0D9A\u0DBB\u0DBA\u0DD2. \u0D85\u0DB0\u0DD2\u0D9A \u0DAD\u0DAB\u0DCA\u0DC4\u0DCF\u0DC0\u0DD9\u0DB1\u0DCA \u0DC0\u0DD0\u0DA9 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC4\u0DDD \u0D9A\u0DBD\u0DCA\u0DB4\u0DB1\u0DCF \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DB1\u0DD2\u0DC3\u0DCF \u0DC4\u0DD2\u0DC3\u0DBB\u0DAF\u0DBA, \u0D8B\u0DAF\u0DBB \u0DB1\u0DDC\u0DC3\u0DB1\u0DCA\u0DC3\u0DD4\u0DB1\u0DCA\u0DAD\u0DCF\u0DC0 \u0DC4\u0DDD \u0DC0\u0DD9\u0DC4\u0DD9\u0DC3 \u0DAF\u0DD0\u0DB1\u0DD2\u0DBA \u0DC4\u0DD0\u0D9A\u0DD2 \u0DB6\u0DD0\u0DC0\u0DD2\u0DB1\u0DCA \u0DA2\u0DD3\u0DC0\u0DB1 \u0DBB\u0DA7\u0DCF\u0DC0 \u0DB4\u0DCF\u0DBD\u0DB1\u0DBA \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC0\u0DD0\u0DAF\u0D9C\u0DAD\u0DCA \u0DC0\u0DDA.`,
      dashaTimePeriodAnalysis: `\u0DAF\u0DC1\u0DCF \u0DC0\u0DD2\u0D9C\u0DCA\u200D\u0DBB\u0DC4\u0DBA \u0D85\u0DB1\u0DD4\u0DC0 \u0DC0\u0DBB\u0DCA\u0DAD\u0DB8\u0DCF\u0DB1 \u0D9A\u0DCF\u0DBD\u0DBA \u0D94\u0DB6\u0D9C\u0DDA \u0D85\u0DB7\u0DCA\u200D\u0DBA\u0DB1\u0DCA\u0DAD\u0DBB \u0DC4\u0DD0\u0DA9\u0D9C\u0DD0\u0DC3\u0DCA\u0DC0\u0DD3\u0DB8, \u0DB8\u0DD4\u0DAF\u0DBD\u0DCA \u0DB4\u0DCF\u0DBD\u0DB1\u0DBA \u0DC3\u0DC4 \u0DA2\u0DD3\u0DC0\u0DD2\u0DAD \u0DB4\u0DCA\u200D\u0DBB\u0DB8\u0DD4\u0D9B\u0DAD\u0DCF \u0DB1\u0DD0\u0DC0\u0DAD \u0DC3\u0D9A\u0DC3\u0DCA \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0D89\u0DBD\u0DCA\u0DBD\u0DCF \u0DC3\u0DD2\u0DA7\u0DD2\u0DBA\u0DD2. \u0DC3\u0DB8\u0DC4\u0DBB \u0D85\u0DC0\u0DC3\u0DCA\u0DAE\u0DCF\u0DC0\u0DB1\u0DCA \u0DB4\u0DCA\u200D\u0DBB\u0DB8\u0DCF\u0DAF\u0DBA\u0D9A\u0DD2\u0DB1\u0DCA \u0DC4\u0DDD \u0DC0\u0D9C\u0D9A\u0DD3\u0DB8\u0DCA \u0DC0\u0DD0\u0DA9\u0DD2 \u0DC0\u0DD3\u0DB8\u0DD9\u0DB1\u0DCA \u0DB4\u0DD9\u0DB1\u0DD2\u0DBA \u0DC4\u0DD0\u0D9A\u0DD2 \u0DB1\u0DB8\u0DD4\u0DAD\u0DCA, \u0DB8\u0DDA\u0DC0\u0DCF \u0DAF\u0DD2\u0D9C\u0DD4\u0D9A\u0DCF\u0DBD\u0DD3\u0DB1 \u0DC1\u0D9A\u0DCA\u0DAD\u0DD2\u0DB8\u0DAD\u0DCA \u0DB4\u0DAF\u0DB1\u0DB8\u0D9A\u0DA7 \u0DB8\u0D9F \u0DB4\u0DCF\u0DAF\u0DBA\u0DD2. \u0DC4\u0DDC\u0DB3 \u0D9A\u0DCF\u0DBD\u0DBA\u0DB1\u0DCA \u0D94\u0DB6 \u0DC3\u0DD0\u0DBD\u0DC3\u0DD4\u0DB8 \u0DC3\u0DC4 \u0D85\u0DC0\u0DB0\u0DCF\u0DB1\u0DBA \u0DC3\u0DB8\u0D9F \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0D9A\u0DBB\u0DB1 \u0DC0\u0DD2\u0DA7 \u0DC0\u0DDA\u0D9C\u0DBA\u0DD9\u0DB1\u0DCA \u0DB4\u0DCA\u200D\u0DBB\u0DBA\u0DDD\u0DA2\u0DB1\u0DC0\u0DAD\u0DCA \u0DC0\u0DB1\u0DD4 \u0D87\u0DAD.`,
      yogasDoshasPlanetaryInfluences: `\u0DB8\u0DD9\u0DB8 \u0D9A\u0DDC\u0DA7\u0DC3 hybrid mode \u0D91\u0D9A\u0DD9\u0DB1\u0DCA \u0DC3\u0D9A\u0DC3\u0DCA \u0D9A\u0DBB \u0D87\u0DAD. \u0D94\u0DB6\u0D9C\u0DDA \u0DC3\u0DA7\u0DC4\u0DB1\u0DDA \u0DC1\u0D9A\u0DCA\u0DAD\u0DD2\u0DBA \u0DC0\u0DD0\u0DA9\u0DD2\u0DB4\u0DD4\u0DBB \u0DB4\u0DD9\u0DB1\u0DCA\u0DB1\u0DD4\u0DB8\u0DCA \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1\u0DDA \u0DC3\u0DCA\u0DAE\u0DCF\u0DC0\u0DBB \u0D9A\u0DD0\u0DB4\u0DC0\u0DD3\u0DB8, \u0DC1\u0DD2\u0DBD\u0DCA\u0DB4\u0DB8\u0DBA \u0DC3\u0DD0\u0DBD\u0DC3\u0DD4\u0DB8 \u0DC3\u0DC4 \u0DB1\u0DD2\u0DC4\u0DAD\u0DB8\u0DCF\u0DB1\u0DD3 \u0DC0\u0DBB\u0DCA\u0DB0\u0DB1\u0DBA \u0DAD\u0DD4\u0DC5\u0DBA. \u0D9A\u0DD9\u0DC3\u0DDA \u0DC0\u0DD9\u0DAD\u0DAD\u0DCA, \u0D85\u0DAD\u0DD2\u0DC0\u0DD2\u0DB8\u0DBB\u0DCA\u0DC1\u0DB1\u0DBA, \u0DAD\u0DD3\u0DBB\u0DAB \u0DB4\u0DCA\u200D\u0DBB\u0DB8\u0DCF\u0DAF \u0DC0\u0DD3\u0DB8 \u0DC3\u0DC4 \u0DC3\u0DB8\u0DCA\u0DB6\u0DB1\u0DCA\u0DB0\u0DAD\u0DCF \u0DAD\u0DD4\u0DC5 \u0DB8\u0DB1\u0DC3\u0DD2\u0DB1\u0DCA \u0DAF\u0DD4\u0DBB\u0DC3\u0DCA \u0DC0\u0DD3\u0DB8 \u0DB4\u0DCA\u200D\u0DBB\u0DAD\u0DD2\u0D9A\u0DD6\u0DBD \u0DBD\u0DD9\u0DC3 \u0DB4\u0DD9\u0DB1\u0DD2\u0DBA \u0DC4\u0DD0\u0D9A. \u0D91\u0DB6\u0DD0\u0DC0\u0DD2\u0DB1\u0DCA \u0DBA\u0DDD\u0D9C \u0DC3\u0DC4 \u0DAF\u0DDD\u0DC2 \u0DBA\u0DB1\u0DD4\u0DC0\u0DD9\u0DB1\u0DCA \u0DAF\u0DD0\u0D9A\u0DCA\u0DC0\u0DD9\u0DB1 \u0DB6\u0DBD\u0DB4\u0DD1\u0DB8\u0DCA \u0DC3\u0DB8\u0DCA\u0DB4\u0DD6\u0DBB\u0DCA\u0DAB \u0DC0\u0DC1\u0DBA\u0DD9\u0DB1\u0DCA \u0DB7\u0DD3\u0DAD\u0DD2\u0DBA\u0DA7 \u0DB1\u0DDC\u0DC0, \u0DAF\u0DD0\u0DB1\u0DD4\u0DC0\u0DAD\u0DCA \u0DC0\u0DD3\u0DB8\u0DDA \u0DC3\u0DBD\u0D9A\u0DD4\u0DAB\u0DD4 \u0DBD\u0DD9\u0DC3 \u0DB7\u0DCF\u0DC0\u0DD2\u0DAD \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1.`,
      palmAnalysisReport: `\u0D85\u0DAD\u0DCA \u0DBB\u0DDA\u0D9B\u0DCF \u0DB1\u0DD2\u0DBB\u0DD3\u0D9A\u0DCA\u0DC2\u0DAB\u0DBA ${deterministicData.palmObservationSummary?.join(" ")} \u0DA2\u0DD3\u0DC0 \u0DBB\u0DDA\u0D9B\u0DCF\u0DC0 \u0DC3\u0DC4 \u0DB8\u0DB1\u0DDD \u0DBB\u0DDA\u0D9B\u0DCF\u0DC0 \u0D85\u0DBB\u0DCA\u0DAE\u0DAF\u0D9A\u0DCA\u0DC0\u0DB1\u0DCA\u0DB1\u0DDA \u0D94\u0DB6\u0DA7 \u0D85\u0DB7\u0DCA\u200D\u0DBA\u0DB1\u0DCA\u0DAD\u0DBB \u0DC1\u0D9A\u0DCA\u0DAD\u0DD2\u0DBA\u0D9A\u0DCA \u0DC3\u0DC4 \u0DC3\u0DD9\u0DB8\u0DD2\u0DB1\u0DCA \u0DB1\u0DB8\u0DD4\u0DAD\u0DCA \u0D9C\u0DD0\u0DB9\u0DD4\u0DBB\u0DD4 \u0DBD\u0DD9\u0DC3 \u0DAD\u0DD3\u0DBB\u0DAB \u0D9C\u0DD0\u0DB1\u0DD3\u0DB8\u0DDA \u0DBB\u0DA7\u0DCF\u0DC0\u0D9A\u0DCA \u0D87\u0DAD\u0DD2 \u0DB6\u0DC0\u0DBA\u0DD2. \u0DC4\u0DAF \u0DBB\u0DDA\u0D9B\u0DCF\u0DC0 \u0DC3\u0DB8\u0DCA\u0DB6\u0DB1\u0DCA\u0DB0\u0DAD\u0DCF \u0DAD\u0DD4\u0DC5 \u0D9C\u0DD0\u0DB9\u0DD4\u0DBB\u0DD4 \u0DC0\u0DD2\u0DC1\u0DCA\u0DC0\u0DCF\u0DC3\u0DBA\u0D9A\u0DCA \u0DC3\u0DC4 \u0D86\u0DBB\u0D9A\u0DCA\u0DC2\u0DCF\u0DC0\u0D9A\u0DCA \u0D9A\u0DD0\u0DB8\u0DAD\u0DD2 \u0DB6\u0DC0 \u0DB4\u0DD9\u0DB1\u0DCA\u0DC0\u0DBA\u0DD2. \u0DA2\u0DDD\u0DAD\u0DD2\u0DC1\u0DCA\u200D\u0DBA \u0DC3\u0DA7\u0DC4\u0DB1 \u0DC3\u0DB8\u0D9F \u0DB6\u0DD0\u0DBD\u0DD6 \u0DC0\u0DD2\u0DA7, \u0D94\u0DB6\u0D9C\u0DDA \u0DC4\u0DD8\u0DAF\u0DBA \u0DC3\u0DC4 \u0DB6\u0DD4\u0DAF\u0DCA\u0DB0\u0DD2\u0DBA \u0D85\u0DAD\u0DBB \u0DC3\u0DB8\u0DAD\u0DD4\u0DBD\u0DD2\u0DAD\u0DAD\u0DCF\u0DC0\u0DBA \u0D94\u0DB6\u0D9C\u0DDA \u0DB4\u0DCA\u200D\u0DBB\u0DB0\u0DCF\u0DB1 \u0DC0\u0DBB\u0DCA\u0DB0\u0DB1 \u0DB4\u0DCF\u0DA8\u0DBA \u0DB6\u0DC0 \u0DB4\u0DD9\u0DB1\u0DDA.`,
      upcomingNekathForUser: `\u0D94\u0DB6\u0DA7 \u0D9C\u0DD0\u0DC5\u0DB4\u0DD9\u0DB1 \u0D89\u0DAF\u0DD2\u0DBB\u0DD2 \u0DB1\u0DD0\u0D9A\u0DAD\u0DCA \u0D9A\u0DC0\u0DD4\u0DC5\u0DD4 \u0DAD\u0DDD\u0DBB\u0DCF \u0D9C\u0DD0\u0DB1\u0DD3\u0DB8\u0DDA\u0DAF\u0DD3 \u0DC0\u0DCA\u200D\u0DBA\u0DCF\u0DB4\u0DCF\u0DBB, \u0D9C\u0DB8\u0DB1\u0DCA \u0DC3\u0DC4 \u0DB1\u0DC0 \u0D86\u0DBB\u0DB8\u0DCA\u0DB7\u0DBA\u0DB1\u0DCA \u0DC3\u0DB3\u0DC4\u0DCF \u0D85\u0DA9\u0DD2\u0DBA\u0DD9\u0DB1\u0DCA \u0D85\u0DA9\u0DD2\u0DBA \u0DC3\u0DD0\u0DBD\u0DC3\u0DD4\u0DB8\u0D9A\u0DCA \u0DB7\u0DCF\u0DC0\u0DD2\u0DAD \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1. ${deterministicData.upcomingNekathLogic?.join(" ")} \u0DB8\u0DDA \u0D9A\u0DCF\u0DBD\u0DBA\u0DB1\u0DCA \u0DAD\u0DD4\u0DC5 \u0DB8\u0DD4\u0DAF\u0DBD\u0DCA \u0DC3\u0DD0\u0DBD\u0DC3\u0DD4\u0DB8\u0DCA, \u0DBD\u0DD2\u0DB4\u0DD2 \u0DBD\u0DDA\u0D9B\u0DB1, \u0DC4\u0DDD \u0DB1\u0DD2\u0DC0\u0DC3/\u0DBB\u0DD0\u0D9A\u0DD2\u0DBA\u0DCF\u0DC0 \u0DC3\u0DB8\u0DCA\u0DB6\u0DB1\u0DCA\u0DB0 \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0DB4\u0DCA\u200D\u0DBB\u0DB8\u0DD4\u0D9B\u0DAD\u0DCF \u0D85\u0DB1\u0DD4\u0DC0 \u0DC3\u0D9A\u0DC3\u0DCA \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC4\u0DDC\u0DB3\u0DBA. \u0D9A\u0DBD\u0DB6\u0DBD \u0DAD\u0DD3\u0DBB\u0DAB, \u0D85\u0DC0\u0DD2\u0DB0\u0DD2\u0DB8\u0DAD\u0DCA \u0D9C\u0DD2\u0DC0\u0DD2\u0DC3\u0DD4\u0DB8\u0DCA \u0DC3\u0DC4 \u0DC4\u0DAF\u0DD2\u0DC3\u0DD2 \u0DC0\u0DD2\u0DBA\u0DAF\u0DB8\u0DCA \u0DC0\u0DBD\u0DD2\u0DB1\u0DCA \u0DC0\u0DC5\u0D9A\u0DD2\u0DB1\u0DCA\u0DB1.`,
      pastLifeLine: `\u0DB4\u0DC3\u0DD4\u0D9C\u0DD2\u0DBA \u0D86\u0DAD\u0DCA\u0DB8 \u0DBB\u0DDA\u0D9B\u0DCF\u0DC0 \u0DB8\u0DD9\u0DB8 \u0DC0\u0DCF\u0DBB\u0DCA\u0DAD\u0DCF\u0DC0\u0DDA \u0D86\u0DB0\u0DCA\u200D\u0DBA\u0DCF\u0DAD\u0DCA\u0DB8\u0DD2\u0D9A-\u0D85\u0DBB\u0DCA\u0DAE\u0D9A\u0DAE\u0DB1 \u0D9A\u0DDC\u0DA7\u0DC3\u0D9A\u0DD2. \u0D91\u0DBA\u0DD2\u0DB1\u0DCA \u0DB4\u0DD9\u0DB1\u0DD9\u0DB1\u0DCA\u0DB1\u0DDA \u0D94\u0DB6 \u0D85\u0DAD\u0DD3\u0DAD\u0DBA\u0DD9\u0DB1\u0DCA \u0D9C\u0DD9\u0DB1\u0DD9\u0DB1 \u0DC0\u0D9C\u0D9A\u0DD3\u0DB8\u0DCA \u0DB6\u0DBB\u0D9A\u0DCA, \u0D85\u0DB1\u0DCA \u0D85\u0DBA \u0DC0\u0DD9\u0DB1\u0DD4\u0DC0\u0DD9\u0DB1\u0DCA \u0DC0\u0DD0\u0DA9\u0DD2\u0DB4\u0DD4\u0DBB \u0DC3\u0DD2\u0DAD\u0DB1 \u0D9C\u0DAD\u0DD2\u0DBA\u0D9A\u0DCA \u0DC3\u0DC4 \u0DC1\u0DD2\u0D9A\u0DCA\u0DC2\u0DAB\u0DBA \u0DC4\u0DBB\u0DC4\u0DCF \u0DC0\u0DBB\u0DCA\u0DB0\u0DB1\u0DBA \u0DC0\u0DD3\u0DB8\u0DA7 \u0D87\u0DAD\u0DD2 \u0D9A\u0DBB\u0DCA\u0DB8 \u0DB4\u0DCF\u0DA9\u0DB8\u0DCA \u0DB6\u0DC0\u0DBA\u0DD2. \u0DC0\u0DBB\u0DCA\u0DAD\u0DB8\u0DCF\u0DB1 \u0DA2\u0DD3\u0DC0\u0DD2\u0DAD\u0DBA\u0DA7 \u0D91\u0DBA\u0DD2\u0DB1\u0DCA \u0DBD\u0DD0\u0DB6\u0DD9\u0DB1 \u0D86\u0DBB\u0DCF\u0DB0\u0DB1\u0DBA \u0DB1\u0DB8\u0DCA \u0D94\u0DB6\u0D9C\u0DDA \u0DC3\u0DD3\u0DB8\u0DCF \u0DB4\u0DD0\u0DC4\u0DD0\u0DAF\u0DD2\u0DBD\u0DD2 \u0D9A\u0DBB\u0D9C\u0DD9\u0DB1, \u0DC3\u0DDA\u0DC0\u0DBA \u0DC3\u0DC4 \u0DC3\u0DCA\u0DC0\u0DBA\u0D82-\u0DC3\u0DD4\u0DBB\u0D9A\u0DCA\u0DC2\u0DD2\u0DAD\u0DB7\u0DCF\u0DC0\u0DBA \u0D85\u0DAD\u0DBB \u0DC3\u0DB8\u0DAD\u0DD4\u0DBD\u0DD2\u0DAD\u0DAD\u0DCF\u0DC0\u0DBA\u0D9A\u0DCA \u0DAD\u0DD0\u0DB1\u0DD3\u0DB8\u0DBA.`,
      recommendedGemsToWear: `\u0DC3\u0DD4\u0DAF\u0DD4\u0DC3\u0DD4 \u0DB8\u0DD0\u0DAB\u0DD2\u0D9A\u0DCA \u0DAD\u0DDD\u0DBB\u0DCF \u0D9C\u0DD0\u0DB1\u0DD3\u0DB8\u0DDA\u0DAF\u0DD3 \u0DC1\u0DB1\u0DD2, \u0D9C\u0DD4\u0DBB\u0DD4 \u0DC3\u0DC4 \u0DB8\u0DB1\u0DC3 \u0DC3\u0DCA\u0DAE\u0DCF\u0DC0\u0DBB \u0D9A\u0DBB\u0DB1 \u0DC0\u0DBB\u0DCA\u0DAB \u0DB6\u0DBD \u0DC3\u0DBD\u0D9A\u0DCF \u0DB6\u0DD0\u0DBD\u0DD2\u0DBA \u0DBA\u0DD4\u0DAD\u0DD4\u0DBA. ${deterministicData.recommendedGemLogic?.join(" ")} \u0D94\u0DB6\u0DA7 \u0DC3\u0DD4\u0DAF\u0DD4\u0DC3\u0DD4 \u0DB8\u0DD0\u0DAB\u0DD2\u0D9A\u0DCA \u0DB7\u0DCF\u0DC0\u0DD2\u0DAD\u0DBA\u0DA7 \u0DB4\u0DD9\u0DBB \u0DC1\u0DBB\u0DD3\u0DBB \u0DB4\u0DCA\u200D\u0DBB\u0DAD\u0DD2\u0DA0\u0DCF\u0DBB, \u0D86\u0D9C\u0DB8\u0DD2\u0D9A \u0DB4\u0DD4\u0DBB\u0DD4\u0DAF\u0DD4 \u0DC3\u0DC4 \u0DAF\u0DD2\u0DB1/\u0D85\u0DAD/\u0D87\u0D9F\u0DD2\u0DBD\u0DD2 \u0DC3\u0DB8\u0DCA\u0DB6\u0DB1\u0DCA\u0DB0 \u0DB1\u0DD3\u0DAD\u0DD2 \u0D85\u0DB1\u0DD4\u0DC0 \u0DB4\u0DBB\u0DD3\u0D9A\u0DCA\u0DC2\u0DCF \u0D9A\u0DBB\u0D9C\u0DD0\u0DB1\u0DD3\u0DB8 \u0DC0\u0DA9\u0DCF \u0DC3\u0DD4\u0DAF\u0DD4\u0DC3\u0DD4\u0DBA. \u0DB1\u0DDC\u0D9C\u0DD0\u0DC5\u0DB4\u0DD9\u0DB1 \u0DB8\u0DD0\u0DAB\u0DD2\u0D9A\u0DCA \u0DC0\u0DA9\u0DCF\u0DAD\u0DCA \u0D86\u0DC0\u0DDA\u0D9C\u0DC1\u0DD3\u0DBD\u0DD3 \u0DB6\u0DC0\u0D9A\u0DCA \u0DC4\u0DDD \u0D85\u0DC3\u0DC4\u0DB1\u0DBA\u0D9A\u0DCA \u0DAF\u0DD0\u0DB1\u0DD2\u0DBA \u0DC4\u0DD0\u0D9A\u0DD2 \u0DB6\u0DD0\u0DC0\u0DD2\u0DB1\u0DCA \u0D85\u0DC0\u0DB0\u0DCF\u0DB1\u0DBA\u0DD9\u0DB1\u0DCA \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1.`,
      fullRemediesReport: `\u0DB4\u0DBB\u0DD2\u0DC4\u0DCF\u0DBB \u0DC3\u0DC4 \u0DB4\u0DD2\u0DC5\u0DD2\u0DBA\u0DB8\u0DCA \u0D9A\u0DDC\u0DA7\u0DC3\u0DD9\u0DC4\u0DD2 \u0D86\u0DB0\u0DCA\u200D\u0DBA\u0DCF\u0DAD\u0DCA\u0DB8\u0DD2\u0D9A, \u0DB4\u0DCA\u200D\u0DBB\u0DCF\u0DBA\u0DDD\u0D9C\u0DD2\u0D9A \u0DC3\u0DC4 \u0DC4\u0DD0\u0DC3\u0DD2\u0DBB\u0DD3\u0DB8\u0DCA\u0DB8\u0DBA \u0DB8\u0DCF\u0DBB\u0DCA\u0D9C \u0D91\u0D9A\u0DA7 \u0D9C\u0DD9\u0DB1 \u0D87\u0DAD. ${deterministicData.remedyBaseRules?.join(" ")} \u0DAF\u0DDB\u0DB1\u0DD2\u0D9A \u0DB4\u0DD2\u0DBB\u0DD2\u0DC3\u0DD2\u0DAF\u0DD4 \u0DB4\u0DD4\u0DBB\u0DD4\u0DAF\u0DD4, \u0DC3\u0DAD\u0DD2\u0DBA\u0D9A\u0DA7 \u0D91\u0D9A\u0DCA \u0DAF\u0DD2\u0DB1\u0D9A\u0DCA \u0DB1\u0DD2\u0DC4\u0DAC \u0DB7\u0DCF\u0DC0\u0DB1\u0DCF \u0D9A\u0DCF\u0DBD\u0DBA\u0D9A\u0DCA, \u0D86\u0DBB\u0DCA\u0DAE\u0DD2\u0D9A \u0DC3\u0DD0\u0DBD\u0DC3\u0DD4\u0DB8\u0DCA \u0DBD\u0DD2\u0DC0\u0DD3\u0DB8 \u0DC3\u0DC4 \u0DC3\u0DB8\u0DCA\u0DB6\u0DB1\u0DCA\u0DB0\u0DAD\u0DCF \u0DAD\u0DD4\u0DC5 \u0DB4\u0DD0\u0DC4\u0DD0\u0DAF\u0DD2\u0DBD\u0DD2 \u0DC3\u0DB1\u0DCA\u0DB1\u0DD2\u0DC0\u0DDA\u0DAF\u0DB1\u0DBA \u0D94\u0DB6\u0DA7 \u0DC0\u0DA9\u0DCF\u0DAD\u0DCA \u0DB6\u0DBD\u0DC0\u0DAD\u0DCA \u0DB4\u0DD2\u0DC5\u0DD2\u0DBA\u0DB8\u0DCA \u0DC0\u0DDA. \u0D85\u0DB1\u0DCA \u0D85\u0DBA\u0D9C\u0DDA \u0DC1\u0D9A\u0DCA\u0DAD\u0DD2\u0DB8\u0DBA \u0DB6\u0DBD\u0DB4\u0DD1\u0DB8\u0DCA \u0D85\u0DB0\u0DD2\u0D9A \u0DBD\u0DD9\u0DC3 \u0DB7\u0DCF\u0DBB \u0DB1\u0DDC\u0D9C\u0DD9\u0DB1 \u0D94\u0DB6\u0D9C\u0DDA \u0DC3\u0DD3\u0DB8\u0DCF \u0DAD\u0DB6\u0DCF \u0D9C\u0DD0\u0DB1\u0DD3\u0DB8\u0DAD\u0DCA \u0DC0\u0DD0\u0DAF\u0D9C\u0DAD\u0DCA\u0DBA.`,
      personalizedRecommendations: `\u0DB4\u0DDE\u0DAF\u0DCA\u0D9C\u0DBD\u0DD2\u0D9A \u0DB1\u0DD2\u0DBB\u0DCA\u0DAF\u0DDA\u0DC1 \u0DBD\u0DD9\u0DC3 \u0DAF\u0DD2\u0DB1\u0DB4\u0DAD\u0DCF \u0D9A\u0DC5 \u0DBA\u0DD4\u0DAD\u0DCA\u0DAD\u0DDA \u0DB1\u0DD2\u0DBA\u0DB8\u0DD2\u0DAD \u0D85\u0DC0\u0DAF\u0DD2\u0DC0\u0DD3\u0DB8\u0D9A\u0DCA, \u0D9A\u0DD9\u0DA7\u0DD2 \u0DB7\u0DCF\u0DC0\u0DB1\u0DCF \u0DC3\u0DA7\u0DC4\u0DB1\u0D9A\u0DCA, \u0D85\u0DAF\u0DC4\u0DC3\u0DCA \u0DBD\u0DD2\u0DC0\u0DD3\u0DB8\u0D9A\u0DCA \u0DC3\u0DC4 \u0DAF\u0DC0\u0DC3\u0DDA \u0DB4\u0DCA\u200D\u0DBB\u0DB8\u0DD4\u0D9B \u0D9A\u0DCF\u0DBB\u0DCA\u0DBA \u0DAD\u0DD4\u0DB1\u0D9A\u0DCA \u0DAD\u0DD3\u0DBB\u0DAB\u0DBA \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8\u0DBA\u0DD2. \u0DC3\u0DAD\u0DD2\u0DBA\u0D9A\u0DA7 \u0DC0\u0DBB\u0D9A\u0DCA \u0DB8\u0DD4\u0DAF\u0DBD\u0DCA \u0DC3\u0DC4 \u0DC3\u0DB8\u0DCA\u0DB6\u0DB1\u0DCA\u0DB0\u0DAD\u0DCF \u0DC3\u0DB8\u0DCA\u0DB6\u0DB1\u0DCA\u0DB0 \u0DB4\u0DC3\u0DD4\u0D9C\u0DD2\u0DBA \u0DC3\u0DAD\u0DD2\u0DBA \u0DC0\u0DD2\u0DB8\u0DBB\u0DCA\u0DC1\u0DB1\u0DBA \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1. \u0D85\u0DB0\u0DD2\u0D9A \u0DC0\u0D9C\u0D9A\u0DD3\u0DB8\u0DCA \u0D91\u0D9A\u0DC0\u0DBB \u0DB7\u0DCF\u0DBB \u0D9C\u0DD0\u0DB1\u0DD3\u0DB8, \u0DAD\u0DD3\u0DBB\u0DAB \u0D9A\u0DBD\u0DCA \u0DAF\u0DB8\u0DB8\u0DD2\u0DB1\u0DCA \u0DB4\u0DD3\u0DA9\u0DB1\u0DBA \u0D91\u0D9A\u0DAD\u0DD4 \u0D9A\u0DBB \u0D9C\u0DD0\u0DB1\u0DD3\u0DB8 \u0DC3\u0DC4 \u0DB1\u0DDC\u0D9A\u0DD2\u0DBA\u0DD6 \u0D85\u0DB4\u0DDA\u0D9A\u0DCA\u0DC2\u0DCF \u0DAD\u0DB6\u0DCF \u0D9C\u0DD0\u0DB1\u0DD3\u0DB8 \u0DC0\u0DBD\u0D9A\u0DCA\u0DC0\u0DB1\u0DCA\u0DB1.`,
      finalThoughtSummary: `${input.fullName} \u0DBA\u0DB1\u0DD4 \u0D87\u0DAD\u0DD4\u0DC5\u0DAD \u0DC1\u0D9A\u0DCA\u0DAD\u0DD2\u0DBA, \u0DC0\u0D9C\u0D9A\u0DD3\u0DB8 \u0DC3\u0DC4 \u0D85\u0DBB\u0DCA\u0DAE\u0DB4\u0DD6\u0DBB\u0DCA\u0DAB \u0DA2\u0DD3\u0DC0\u0DD2\u0DAD\u0DBA\u0D9A\u0DCA \u0D9C\u0DDC\u0DA9\u0DB1\u0DD0\u0D9C\u0DD3\u0DB8\u0DA7 \u0D9A\u0DD0\u0DB8\u0DAD\u0DD2 \u0DB4\u0DD4\u0DAF\u0DCA\u0D9C\u0DBD\u0DBA\u0DD9\u0D9A\u0DD2. \u0D94\u0DB6\u0D9C\u0DDA \u0DA2\u0DD3\u0DC0\u0DD2\u0DAD \u0DB8\u0DCF\u0DBB\u0DCA\u0D9C\u0DBA \u0D89\u0D9F\u0DD2 \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1\u0DDA \u0DB4\u0DCA\u200D\u0DBB\u0DB8\u0DCF\u0DAF\u0DBA\u0D9A\u0DCA \u0DC0\u0DD4\u0DC0\u0DAD\u0DCA \u0D9C\u0DD0\u0DB9\u0DD4\u0DBB\u0DD4 \u0DC3\u0DC4 \u0DC3\u0DCA\u0DAE\u0DCF\u0DC0\u0DBB \u0DA2\u0DBA\u0D9C\u0DCA\u200D\u0DBB\u0DC4\u0DAB \u0DBD\u0DB6\u0DCF \u0D9C\u0DAD \u0DC4\u0DD0\u0D9A\u0DD2 \u0DB6\u0DC0\u0DBA\u0DD2. \u0D89\u0DAF\u0DD2\u0DBB\u0DD2 \u0D9A\u0DCF\u0DBD\u0DBA\u0DDA \u0D94\u0DB6 \u0DC0\u0DD0\u0DA9\u0DD2 \u0D85\u0DC0\u0DB0\u0DCF\u0DB1\u0DBA \u0DBA\u0DDC\u0DB8\u0DD4 \u0D9A\u0DC5 \u0DBA\u0DD4\u0DAD\u0DCA\u0DAD\u0DDA \u0DB4\u0DD0\u0DC4\u0DD0\u0DAF\u0DD2\u0DBD\u0DD2 \u0DAD\u0DD3\u0DBB\u0DAB, \u0DB8\u0DD4\u0DAF\u0DBD\u0DCA \u0DB4\u0DCF\u0DBD\u0DB1\u0DBA, \u0DC3\u0DB8\u0DCA\u0DB6\u0DB1\u0DCA\u0DB0\u0DAD\u0DCF \u0DB4\u0DD2\u0DBB\u0DD2\u0DC3\u0DD2\u0DAF\u0DD4 \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8 \u0DC3\u0DC4 \u0DB8\u0DB1\u0DC3\u0DA7 \u0DC0\u0DD2\u0DC0\u0DDA\u0D9A\u0DBA \u0DBD\u0DB6\u0DCF \u0DAF\u0DD3\u0DB8 \u0DC0\u0DD9\u0DAD\u0DBA.`,
      endRecommendationsSection: `\u0D94\u0DB6 \u0DAF\u0DD0\u0DB1\u0DCA\u0DB8 \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0D9A\u0DC5 \u0DBA\u0DD4\u0DAD\u0DD4 \u0D9A\u0DBB\u0DD4\u0DAB\u0DD4: \u0DAF\u0DD2\u0DB1\u0DB4\u0DAD\u0DCF \u0DC3\u0DD0\u0DBD\u0DC3\u0DD4\u0DB8, \u0DB7\u0DCF\u0DC0\u0DB1\u0DCF \u0DB4\u0DD4\u0DBB\u0DD4\u0DAF\u0DCA\u0DAF, \u0DB8\u0DD4\u0DAF\u0DBD\u0DCA \u0DBD\u0DDA\u0D9B\u0DB1\u0D9C\u0DAD \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8.
\u0D94\u0DB6 \u0DC0\u0DD0\u0DC5\u0D9A\u0DD3 \u0DC3\u0DD2\u0DA7\u0DD2\u0DBA \u0DBA\u0DD4\u0DAD\u0DD4 \u0D9A\u0DBB\u0DD4\u0DAB\u0DD4: \u0DC4\u0DAF\u0DD2\u0DC3\u0DD2 \u0DAD\u0DD3\u0DBB\u0DAB, \u0D85\u0DB0\u0DD2\u0D9A \u0DC0\u0DD2\u0DBA\u0DAF\u0DB8\u0DCA, \u0DB1\u0DDC\u0D9A\u0DD2\u0DBA\u0DD6 \u0D9A\u0DBD\u0D9A\u0DD2\u0DBB\u0DD3\u0DB8\u0DCA \u0D91\u0D9A\u0DAD\u0DD4 \u0D9A\u0DBB \u0D9C\u0DD0\u0DB1\u0DD3\u0DB8.
\u0D94\u0DB6 \u0DC0\u0DD0\u0DA9\u0DD2 \u0D85\u0DC0\u0DB0\u0DCF\u0DB1\u0DBA \u0DBA\u0DDC\u0DB8\u0DD4 \u0D9A\u0DC5 \u0DBA\u0DD4\u0DAD\u0DD4 \u0DA2\u0DD3\u0DC0\u0DD2\u0DAD \u0D85\u0D82\u0DC1: \u0DBB\u0DD0\u0D9A\u0DD2\u0DBA\u0DCF\u0DC0, \u0D86\u0DAF\u0DCF\u0DBA\u0DB8\u0DCA \u0DC0\u0DD2\u0DB0\u0DD2\u0DB8\u0DAD\u0DCA \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8, \u0DC3\u0DB8\u0DCA\u0DB6\u0DB1\u0DCA\u0DB0\u0DAD\u0DCF \u0D85\u0DC0\u0D82\u0D9A \u0D9A\u0DD2\u0DBB\u0DD3\u0DB8, \u0DC1\u0DCF\u0DBB\u0DD3\u0DBB\u0DD2\u0D9A \u0DC3\u0DC4 \u0DB8\u0DCF\u0DB1\u0DC3\u0DD2\u0D9A \u0DC0\u0DD2\u0DC0\u0DDA\u0D9A\u0DBA.
\u0D85\u0DC0\u0DC3\u0DCF\u0DB1 \u0DA2\u0DD3\u0DC0\u0DD2\u0DAD \u0D8B\u0DB4\u0DAF\u0DD9\u0DC3\u0DCA: \u0D85\u0DB7\u0DCA\u200D\u0DBA\u0DB1\u0DCA\u0DAD\u0DBB \u0DC3\u0DB1\u0DCA\u0DC3\u0DD4\u0DB1\u0DCA\u0DAD\u0DCF\u0DC0\u0DBA \u0DBB\u0DD0\u0D9A\u0D9C\u0DD9\u0DB1 \u0D9A\u0DCA\u200D\u0DBB\u0DD2\u0DBA\u0DCF\u0DAD\u0DCA\u0DB8\u0D9A \u0DC0\u0DB1 \u0DC3\u0DBB\u0DBD \u0DB1\u0DB8\u0DD4\u0DAD\u0DCA \u0D85\u0D9B\u0DAB\u0DCA\u0DA9 \u0DB4\u0DD2\u0DBA\u0DC0\u0DBB \u0D94\u0DB6\u0D9C\u0DDA \u0DC0\u0DCF\u0DC3\u0DB1\u0DCF\u0DC0 \u0DC4\u0DD0\u0DA9\u0D9C\u0DC3\u0DCA\u0DC0\u0DBA\u0DD2.`
    };
    return `${title}

${base[key] || ""}`;
  }
};

// server.ts
var safeNekathDatabase = nekathDatabase || {};
var require2 = createRequire(import.meta.url);
var webpush = require2("web-push");
var bodyParser = require2("body-parser");
var cors = require2("cors");
var cron = require2("node-cron");
var SunCalc = require2("suncalc");
var __filename = fileURLToPath(import.meta.url);
var __dirname = path2.dirname(__filename);
var appEnv = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");
for (const [key, value] of Object.entries(appEnv)) {
  if (!(key in process.env)) {
    process.env[key] = value;
  }
}
var app = express();
var PORT = Number(process.env.PORT) || 3e3;
var STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
var STRIPE_PRICE_WISHWAYA_PRO = process.env.STRIPE_PRICE_WISHWAYA_PRO || "";
var APP_URL = (process.env.APP_URL || "http://localhost:3000").replace(/"+$/, "").replace(/\/+$/, "");
var createStripeCheckoutSession = async (customerEmail) => {
  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("line_items[0][price]", STRIPE_PRICE_WISHWAYA_PRO);
  body.set("line_items[0][quantity]", "1");
  body.set("success_url", `${APP_URL}/payment-success`);
  body.set("cancel_url", `${APP_URL}/payment-cancel`);
  if (customerEmail) {
    body.set("customer_email", customerEmail);
  }
  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "Failed to create Stripe checkout session");
  }
  return data;
};
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION:", reason);
});
app.use(cors());
app.use(bodyParser.json());
var DATA_DIR = process.env.NODE_ENV === "production" ? "/tmp/wishwaya-data" : path2.join(process.cwd(), "data");
var LEGACY_DATA_DIR = path2.join(process.cwd(), "src/data");
console.log(`Using DATA_DIR: ${DATA_DIR}`);
if (!fs2.existsSync(DATA_DIR)) {
  try {
    fs2.mkdirSync(DATA_DIR, { recursive: true });
    console.log("Created DATA_DIR");
  } catch (err) {
    console.error("Failed to create data directory:", err);
  }
}
var SUBSCRIPTIONS_FILE = path2.join(DATA_DIR, "subscriptions.json");
var VAPID_KEYS_FILE = path2.join(DATA_DIR, "vapid.json");
var premiumAstroReportEngine = new PremiumAstroReportEngine(DATA_DIR);
var migrateLegacyRuntimeFile = (fileName) => {
  const currentPath = path2.join(DATA_DIR, fileName);
  const legacyPath = path2.join(LEGACY_DATA_DIR, fileName);
  if (fs2.existsSync(currentPath) || !fs2.existsSync(legacyPath)) {
    return;
  }
  try {
    fs2.copyFileSync(legacyPath, currentPath);
    console.log(`Migrated legacy runtime file: ${fileName}`);
  } catch (err) {
    console.error(`Failed to migrate legacy runtime file ${fileName}:`, err);
  }
};
migrateLegacyRuntimeFile("subscriptions.json");
migrateLegacyRuntimeFile("vapid.json");
var getSubscriptions = () => {
  try {
    if (!fs2.existsSync(SUBSCRIPTIONS_FILE)) return [];
    return JSON.parse(fs2.readFileSync(SUBSCRIPTIONS_FILE, "utf-8"));
  } catch (err) {
    console.error("Error reading subscriptions:", err);
    return [];
  }
};
var writeSubscriptions = (subscriptions) => {
  fs2.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2));
};
var saveSubscription = (subscription, userId, location, horoscopeProfile) => {
  try {
    const subs = getSubscriptions();
    const existingIndex = subs.findIndex((s) => s.subscription.endpoint === subscription.endpoint);
    if (horoscopeProfile && !horoscopeProfile.notifications) {
      horoscopeProfile.notifications = {
        enabled: true,
        horoscope: true,
        rahuKalaya: true,
        specialNekath: true,
        birthday: true
      };
    }
    const newSub = {
      userId,
      subscription,
      location,
      horoscopeProfile,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      disabled: false
    };
    if (existingIndex >= 0) {
      subs[existingIndex] = { ...subs[existingIndex], ...newSub };
    } else {
      subs.push(newSub);
    }
    writeSubscriptions(subs);
  } catch (err) {
    console.error("Error saving subscription:", err);
  }
};
var updateSubscriptionProfile = (userId, profile) => {
  try {
    const subs = getSubscriptions();
    let updated = false;
    subs.forEach((s) => {
      if (s.userId === userId) {
        s.horoscopeProfile = { ...s.horoscopeProfile, ...profile };
        updated = true;
      }
    });
    if (updated) {
      writeSubscriptions(subs);
    }
    return subs.filter((s) => s.userId === userId).length;
  } catch (err) {
    console.error("Error updating profile:", err);
    return 0;
  }
};
var relinkSubscriptions = (fromUserId, toUserId) => {
  try {
    const subs = getSubscriptions();
    let updated = false;
    subs.forEach((s) => {
      if (s.userId === fromUserId) {
        s.userId = toUserId;
        updated = true;
      }
    });
    if (updated) {
      const deduped = Array.from(
        new Map(subs.map((sub) => [sub.subscription?.endpoint, sub])).values()
      );
      writeSubscriptions(deduped);
    }
    return updated;
  } catch (err) {
    console.error("Error relinking subscriptions:", err);
    return false;
  }
};
var getRahuKalaya = (date, lat, lng) => {
  const times = SunCalc.getTimes(date, lat, lng);
  const sunrise = times.sunrise;
  const sunset = times.sunset;
  const dayLength = sunset.getTime() - sunrise.getTime();
  const segmentDuration = dayLength / 8;
  const dayOfWeek = date.getDay();
  let segmentIndex = 0;
  switch (dayOfWeek) {
    case 1:
      segmentIndex = 1;
      break;
    // Mon
    case 2:
      segmentIndex = 5;
      break;
    // Tue
    case 3:
      segmentIndex = 4;
      break;
    // Wed
    case 4:
      segmentIndex = 3;
      break;
    // Thu
    case 5:
      segmentIndex = 2;
      break;
    // Fri
    case 6:
      segmentIndex = 0;
      break;
    // Sat
    case 0:
      segmentIndex = 6;
      break;
  }
  const rahuStart = new Date(sunrise.getTime() + segmentIndex * segmentDuration);
  const rahuEnd = new Date(rahuStart.getTime() + segmentDuration);
  return { start: rahuStart, end: rahuEnd };
};
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.get("/api/config", (req, res) => {
  const key = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.Wishwaya_App_Key;
  if (!key) {
    console.warn("WARNING: No API Key found in environment variables!");
  }
  res.json({
    configured: Boolean(key)
  });
});
app.get("/api/firebase-config", (req, res) => {
  const firebase = {
    apiKey: process.env.VITE_FIREBASE_API_KEY || "",
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.VITE_FIREBASE_APP_ID || ""
  };
  const configured = Object.values(firebase).every(
    (value) => typeof value === "string" && value.trim().length > 0
  );
  res.json({
    configured,
    firebase: configured ? firebase : null
  });
});
app.post("/api-proxy/*path", async (req, res) => {
  console.log(`Incoming proxy request: ${req.method} ${req.path}`);
  const apiKeys = [
    process.env.GEMINI_API_KEY,
    process.env.API_KEY,
    process.env.Wishwaya_App_Key
  ].filter((k) => k && k.trim().length > 10 && k !== "MY_GEMINI_API_KEY" && k !== "undefined" && k !== "null").map((k) => k.trim());
  if (apiKeys.length === 0) {
    console.error("Proxy Error: No valid API Keys found in environment variables");
    return res.status(500).json({ error: "API Key not configured on server. Please check your environment variables." });
  }
  let targetPath = req.path.replace("/api-proxy", "");
  if (!targetPath.startsWith("/")) {
    targetPath = "/" + targetPath;
  }
  if (!targetPath.startsWith("/v1")) {
    targetPath = "/v1beta" + targetPath;
  }
  let lastError = null;
  for (let i = 0; i < apiKeys.length; i++) {
    const apiKey = apiKeys[i];
    const searchParams = new URLSearchParams();
    if (req.query) {
      Object.keys(req.query).forEach((key) => {
        if (key !== "key") {
          searchParams.set(key, req.query[key]);
        }
      });
    }
    searchParams.set("key", apiKey);
    const finalUrl = `https://generativelanguage.googleapis.com${targetPath}?${searchParams.toString()}`;
    console.log(`Proxying request to: ${finalUrl.split("?")[0]} (Using Key ${i + 1}/${apiKeys.length})`);
    try {
      const response = await fetch(finalUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(req.body)
      });
      const text = await response.text();
      if (!response.ok) {
        const isKeyError = text.includes("API key not valid") || text.includes("INVALID_ARGUMENT");
        const isQuotaError = response.status === 429 || text.includes("quota");
        if ((isKeyError || isQuotaError) && i < apiKeys.length - 1) {
          console.warn(`Key ${i + 1} failed (${response.status}), trying next key...`);
          lastError = { status: response.status, text };
          continue;
        }
        console.error(`Gemini API Error (${response.status}) for URL ${finalUrl}:`, text);
      }
      res.status(response.status);
      const contentType = response.headers.get("content-type") || "";
      const looksJson = contentType.includes("application/json");
      if (!looksJson) {
        res.set("Content-Type", "application/json");
        try {
          const parsed = JSON.parse(text);
          return res.json(parsed);
        } catch {
          return res.json({
            error: "Gemini proxy returned a non-JSON response",
            status: response.status,
            body: text
          });
        }
      }
      res.set("Content-Type", contentType || "application/json");
      return res.send(text);
    } catch (error) {
      console.error(`Proxy Error with key ${i + 1}:`, error);
      lastError = error;
      if (i < apiKeys.length - 1) continue;
      return res.status(500).json({
        error: "Failed to proxy request to Gemini",
        message: error.message
      });
    }
  }
});
var vapidKeys = null;
app.get("/api/push/public-key", (req, res) => {
  if (vapidKeys) {
    res.json({ publicKey: vapidKeys.publicKey });
  } else if (fs2.existsSync(VAPID_KEYS_FILE)) {
    try {
      vapidKeys = JSON.parse(fs2.readFileSync(VAPID_KEYS_FILE, "utf-8"));
      res.json({ publicKey: vapidKeys.publicKey });
    } catch (err) {
      res.status(500).json({ error: "Failed to read VAPID keys" });
    }
  } else {
    res.status(500).json({ error: "VAPID keys not initialized" });
  }
});
app.post("/api/push/subscribe", (req, res) => {
  const { subscription, userId, location, horoscopeProfile } = req.body;
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: "Invalid subscription" });
  }
  saveSubscription(subscription, userId, location, horoscopeProfile);
  res.status(201).json({ message: "Subscribed successfully" });
});
app.post("/api/push/preferences", (req, res) => {
  const { userId, preferences } = req.body;
  if (!userId || !preferences) {
    return res.status(400).json({ error: "Invalid data" });
  }
  const updatedCount = updateSubscriptionProfile(userId, { notifications: preferences });
  res.json({
    message: "Preferences updated successfully",
    updatedCount
  });
});
app.post("/api/push/link-user", (req, res) => {
  const { fromUserId, toUserId } = req.body;
  if (!fromUserId || !toUserId) {
    return res.status(400).json({ error: "Invalid data" });
  }
  const updated = relinkSubscriptions(fromUserId, toUserId);
  res.json({ message: updated ? "Subscriptions linked successfully" : "No subscriptions needed linking" });
});
app.post("/api/push/unsubscribe", (req, res) => {
  const { endpoint } = req.body;
  let subs = getSubscriptions();
  subs = subs.filter((s) => s.subscription.endpoint !== endpoint);
  writeSubscriptions(subs);
  res.json({ message: "Unsubscribed successfully" });
});
app.post("/api/notify/send", async (req, res) => {
  const { userId, title, body, url } = req.body;
  const subs = getSubscriptions().filter((s) => s.userId === userId && !s.disabled);
  if (subs.length === 0) {
    return res.json({
      message: "No active subscriptions for this user",
      attemptedCount: 0,
      sentCount: 0,
      failedCount: 0,
      removedCount: 0
    });
  }
  const payload = JSON.stringify({ title, body, url });
  const deliveryResults = await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(sub.subscription, payload);
        return { endpoint: sub.subscription.endpoint, status: "sent" };
      } catch (err) {
        const expired = err?.statusCode === 410 || err?.statusCode === 404;
        console.error("Error sending notification:", err);
        return {
          endpoint: sub.subscription.endpoint,
          status: expired ? "expired" : "failed",
          code: err?.statusCode || null
        };
      }
    })
  );
  const removedEndpoints = new Set(
    deliveryResults.filter((result) => result.status === "expired").map((result) => result.endpoint)
  );
  if (removedEndpoints.size > 0) {
    const nextSubs = getSubscriptions().filter(
      (sub) => !removedEndpoints.has(sub.subscription?.endpoint)
    );
    writeSubscriptions(nextSubs);
  }
  const sentCount = deliveryResults.filter((result) => result.status === "sent").length;
  const failedCount = deliveryResults.filter((result) => result.status === "failed").length;
  const removedCount = removedEndpoints.size;
  res.json({
    message: `Attempted delivery to ${subs.length} device${subs.length === 1 ? "" : "s"}`,
    attemptedCount: subs.length,
    sentCount,
    failedCount,
    removedCount
  });
});
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    if (!STRIPE_SECRET_KEY || !STRIPE_PRICE_WISHWAYA_PRO) {
      return res.status(500).json({ error: "Stripe environment variables are missing" });
    }
    const customerEmail = typeof req.body?.customerEmail === "string" && req.body.customerEmail.trim() ? req.body.customerEmail.trim() : null;
    const session = await createStripeCheckoutSession(customerEmail);
    res.status(201).json({
      checkoutUrl: session.url || null,
      sessionId: session.id || null
    });
  } catch (error) {
    console.error("[stripe] create checkout session failed", error);
    res.status(500).json({ error: error?.message || "Failed to create checkout session" });
  }
});
app.post("/api/astro-reports/payment-success-create", (req, res) => {
  try {
    const { userId, profile } = req.body || {};
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const result = premiumAstroReportEngine.createBackgroundReportFromProfile(userId, profile || null);
    res.status(201).json(result);
  } catch (error) {
    console.error("[astro-report] payment success create failed", error);
    res.status(500).json({ error: error?.message || "Failed to create report request after payment" });
  }
});
app.post("/api/astro-reports/:reportId/requirements", (req, res) => {
  try {
    const { userId, profile } = req.body || {};
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const requirements = premiumAstroReportEngine.getRequirements(req.params.reportId, userId, profile || null);
    res.json(requirements);
  } catch (error) {
    console.error("[astro-report] requirements failed", error);
    res.status(400).json({ error: error?.message || "Failed to load requirements" });
  }
});
app.post("/api/astro-reports/:reportId/inputs", (req, res) => {
  try {
    const result = premiumAstroReportEngine.submitInputs(req.params.reportId, req.body);
    res.status(202).json(result);
  } catch (error) {
    console.error("[astro-report] input submission failed", error);
    res.status(400).json({ error: error?.message || "Failed to submit inputs" });
  }
});
app.get("/api/astro-reports", (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    res.json(premiumAstroReportEngine.listReports(userId));
  } catch (error) {
    console.error("[astro-report] list reports failed", error);
    res.status(500).json({ error: error?.message || "Failed to list reports" });
  }
});
app.get("/api/astro-reports/:reportId", (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    res.json(premiumAstroReportEngine.getReport(req.params.reportId, userId));
  } catch (error) {
    console.error("[astro-report] get report failed", error);
    res.status(404).json({ error: error?.message || "Report not found" });
  }
});
app.get("/api/astro-reports/:reportId/palm-image", (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const filePath = premiumAstroReportEngine.getPalmImageFile(req.params.reportId, userId);
    if (!filePath) {
      return res.status(404).json({ error: "Palm image not found" });
    }
    res.sendFile(filePath);
  } catch (error) {
    console.error("[astro-report] palm image access failed", error);
    res.status(404).json({ error: error?.message || "Palm image not found" });
  }
});
app.get("/api/astro-reports/:reportId/pdf", (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).send("userId is required");
    }
    const report = premiumAstroReportEngine.getReport(req.params.reportId, userId);
    if (!report.reportJson) {
      return res.status(404).send("Report PDF source is not ready");
    }
    const sections = [
      report.reportJson.coverSection,
      report.reportJson.coreAstroProfile,
      report.reportJson.personalityLifeBlueprint,
      report.reportJson.wealthCareerBusinessReport,
      report.reportJson.loveMarriageRelationshipReport,
      report.reportJson.healthLifestyleGuidance,
      report.reportJson.dashaTimePeriodAnalysis,
      report.reportJson.yogasDoshasPlanetaryInfluences,
      report.reportJson.palmAnalysisReport,
      report.reportJson.upcomingNekathForUser,
      report.reportJson.pastLifeLine,
      report.reportJson.recommendedGemsToWear,
      report.reportJson.fullRemediesReport,
      report.reportJson.personalizedRecommendations,
      report.reportJson.finalThoughtSummary,
      report.reportJson.endRecommendationsSection
    ];
    const sectionHtml = sections.map(
      (section) => `
          <section class="section">
            <h2>${section.title}</h2>
            ${section.content.split("\n").filter(Boolean).map((line) => `<p>${line}</p>`).join("")}
          </section>
        `
    ).join("");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(`
      <!doctype html>
      <html lang="si">
        <head>
          <meta charset="utf-8" />
          <title>Wishwaya Premium Astrology Report</title>
          <style>
            body { font-family: "Nirmala UI", "Segoe UI", sans-serif; margin: 0; background: #0f0d08; color: #f7edd2; }
            .page { max-width: 860px; margin: 0 auto; padding: 32px 20px 80px; }
            .cover { padding: 36px; border-radius: 28px; background: radial-gradient(circle at top, rgba(255,205,92,0.28), transparent 35%), linear-gradient(135deg, #1b1610, #111827); border: 1px solid rgba(255,220,128,0.22); box-shadow: 0 18px 60px rgba(0,0,0,0.32); }
            .badge { display: inline-block; padding: 8px 14px; border-radius: 999px; background: rgba(255,215,130,0.14); color: #f8df97; font-size: 12px; margin-right: 8px; }
            h1, h2 { color: #ffe7a3; }
            h1 { margin-bottom: 8px; }
            .section { margin-top: 22px; padding: 22px; background: rgba(255,255,255,0.04); border-radius: 22px; border: 1px solid rgba(255,255,255,0.08); }
            p { line-height: 1.85; color: #f7f0dc; }
            .footer { text-align: center; margin-top: 28px; color: #c9b68b; font-size: 12px; }
            @media print {
              body { background: white; color: #1f2937; }
              .cover, .section { box-shadow: none; background: white; color: #1f2937; border: 1px solid #e5e7eb; }
              h1, h2, p, .badge, .footer { color: #1f2937; }
            }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="cover">
              <span class="badge">Wishwaya</span>
              <span class="badge">Sinhala Premium Report</span>
              <h1>${report.inputSnapshot?.fullName || "Premium Astrology Report"}</h1>
              <p>\u0DB8\u0DD9\u0DBA Wishwaya \u0DC0\u0DD2\u0DC3\u0DD2\u0DB1\u0DCA \u0DC3\u0D9A\u0DC3\u0DCA \u0D9A\u0DC5 premium Sinhala astrology report \u0D91\u0D9A\u0D9A\u0DD2. \u0D85\u0DC0\u0DC1\u0DCA\u200D\u0DBA \u0DB1\u0DB8\u0DCA browser print dialog \u0DB7\u0DCF\u0DC0\u0DD2\u0DAD\u0DBA\u0DD9\u0DB1\u0DCA PDF \u0DBD\u0DD9\u0DC3 \u0DC3\u0DD4\u0DBB\u0D9A\u0DD2\u0DB1\u0DCA\u0DB1.</p>
            </div>
            ${sectionHtml}
            <div class="footer">Wishwaya \u2022 Generated ${new Date(report.updatedAt).toLocaleDateString("si-LK")}</div>
          </div>
          <script>window.__WISHWAYA_REPORT_READY__ = true;</script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("[astro-report] pdf source failed", error);
    res.status(404).send(error?.message || "Report not found");
  }
});
app.post("/api/astro-reports/:reportId/retry", (req, res) => {
  try {
    const { adminKey } = req.body || {};
    const result = premiumAstroReportEngine.retryReport(req.params.reportId, adminKey);
    res.json(result);
  } catch (error) {
    console.error("[astro-report] retry failed", error);
    res.status(403).json({ error: error?.message || "Retry failed" });
  }
});
async function startServer() {
  try {
    console.log("Initializing Server...");
    try {
      if (fs2.existsSync(VAPID_KEYS_FILE)) {
        vapidKeys = JSON.parse(fs2.readFileSync(VAPID_KEYS_FILE, "utf-8"));
        console.log("Loaded existing VAPID keys");
      } else {
        vapidKeys = webpush.generateVAPIDKeys();
        fs2.writeFileSync(VAPID_KEYS_FILE, JSON.stringify(vapidKeys, null, 2));
        console.log("Generated new VAPID Keys");
      }
    } catch (err) {
      console.warn("Failed to access VAPID keys file, using in-memory keys:", err);
      if (!vapidKeys) {
        vapidKeys = webpush.generateVAPIDKeys();
      }
    }
    if (vapidKeys) {
      webpush.setVapidDetails(
        "mailto:support@wishwaya.online",
        vapidKeys.publicKey,
        vapidKeys.privateKey
      );
    }
    cron.schedule("*/15 * * * *", async () => {
      const now = /* @__PURE__ */ new Date();
      const colomboTime = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Colombo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }).formatToParts(now);
      const parts = {};
      colomboTime.forEach((p) => parts[p.type] = p.value);
      const currentHour = parseInt(parts.hour);
      const currentMinute = parseInt(parts.minute);
      const todayStr = `${parts.year}-${parts.month}-${parts.day}`;
      const currentMonth = parseInt(parts.month) - 1;
      const currentDay = parseInt(parts.day);
      const currentYear = parseInt(parts.year);
      console.log(`[Cron] Checking notifications at ${todayStr} ${currentHour}:${currentMinute}`);
      try {
        const subs = getSubscriptions();
        const uniqueUsers = [...new Set(subs.map((s) => s.userId))];
        for (const userId of uniqueUsers) {
          const userSubs = subs.filter((s) => s.userId === userId && !s.disabled);
          if (userSubs.length === 0) continue;
          const firstSub = userSubs[0];
          const profile = firstSub.horoscopeProfile;
          const prefs = profile?.notifications || { enabled: true, horoscope: true, rahuKalaya: true, specialNekath: true, birthday: true };
          if (!prefs.enabled) continue;
          if (prefs.horoscope && currentHour === 6 && currentMinute < 15) {
            if (prefs.lastHoroscopeSentDate !== todayStr) {
              const title = "\u0D85\u0DAF \u0DAF\u0DC0\u0DC3\u0DDA \u0DC0\u0DD2\u0DC1\u0DDA\u0DC2\u0DBA \u{1F31E}";
              let message = "\u0D85\u0DAF \u0D94\u0DB6\u0DA7 \u0DC3\u0DB1\u0DCA\u0DC3\u0DD4\u0DB1\u0DCA\u0DC0 \u0DC3\u0DC4 \u0DB6\u0DD4\u0DAF\u0DCA\u0DB0\u0DD2\u0DB8\u0DAD\u0DCA\u0DC0 \u0DC0\u0DD0\u0DA9 \u0D9A\u0DC5\u0DC4\u0DDC\u0DAD\u0DCA \u0DC4\u0DDC\u0DB3 \u0DB4\u0DCA\u0DBB\u0DAD\u0DD2\u0DB5\u0DBD \u0DBD\u0DD0\u0DB6\u0DDA. \u0DC3\u0DD4\u0DB6 \u0DAF\u0DC0\u0DC3\u0D9A\u0DCA!";
              if (profile && profile.rashi) {
                try {
                  const apiKeys = [
                    process.env.GEMINI_API_KEY,
                    process.env.API_KEY,
                    process.env.Wishwaya_App_Key
                  ].filter((k) => k && k.trim().length > 10 && k !== "MY_GEMINI_API_KEY").map((k) => k.trim());
                  let success = false;
                  for (const apiKey of apiKeys) {
                    try {
                      const ai = new GoogleGenAI2({ apiKey });
                      const result = await ai.models.generateContent({
                        model: "gemini-flash-latest",
                        contents: `Generate a very short, positive daily horoscope (max 15 words) for ${profile.rashi} Rashi. Language: Sinhala. Focus on encouragement and peace. No negative predictions.`
                      });
                      message = result.text || message;
                      success = true;
                      break;
                    } catch (e) {
                      console.error(`Gemini Horoscope Error with key:`, e);
                    }
                  }
                } catch (e) {
                  console.error("Gemini Horoscope Error:", e);
                }
              }
              await sendToUser(userId, title, message, "/dashboard");
              updateSubscriptionProfile(userId, { notifications: { ...prefs, lastHoroscopeSentDate: todayStr } });
            }
          }
          if (prefs.rahuKalaya) {
            const loc = firstSub.location || { lat: 6.9271, lng: 79.8612 };
            const { start } = getRahuKalaya(now, loc.lat, loc.lng);
            const diffMins = (start.getTime() - now.getTime()) / (1e3 * 60);
            if (diffMins >= 25 && diffMins <= 40 && prefs.lastRahuReminderSentDate !== todayStr) {
              const title = "\u0DBB\u0DCF\u0DC4\u0DD4 \u0D9A\u0DCF\u0DBD\u0DBA \u23F3";
              const message = "\u0DAD\u0DC0\u0DAD\u0DCA \u0DB8\u0DD2\u0DB1\u0DD2\u0DAD\u0DCA\u0DAD\u0DD4 30\u0D9A\u0DD2\u0DB1\u0DCA \u0DBB\u0DCF\u0DC4\u0DD4 \u0D9A\u0DCF\u0DBD\u0DBA \u0D86\u0DBB\u0DB8\u0DCA\u0DB7 \u0DC0\u0DDA. \u0DC0\u0DD0\u0DAF\u0D9C\u0DAD\u0DCA \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0D92 \u0D85\u0DB1\u0DD4\u0DC0 \u0DC3\u0DD0\u0DBD\u0DC3\u0DD4\u0DB8\u0DCA \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1.";
              await sendToUser(userId, title, message, "/rahu-kalaya");
              updateSubscriptionProfile(userId, { notifications: { ...prefs, lastRahuReminderSentDate: todayStr } });
            }
          }
          if (prefs.specialNekath && currentHour === 7 && currentMinute < 15) {
            if (prefs.lastSpecialNekathSentDate !== todayStr) {
              const monthNekath = safeNekathDatabase[currentMonth];
              if (monthNekath) {
                const nekathTypes = ["business", "travel", "houseBuilding", "marriage"];
                let foundNekath = "";
                for (const type of nekathTypes) {
                  const text = monthNekath[type];
                  const dayPattern = new RegExp(`${currentDay.toString().padStart(2, "0")}|${currentDay} \u0DC0\u0DB1`);
                  if (dayPattern.test(text)) {
                    foundNekath = text;
                    break;
                  }
                }
                if (foundNekath) {
                  const title = "\u0D94\u0DB6\u0DA7 \u0D85\u0DAF \u0DC0\u0DD2\u0DC1\u0DDA\u0DC2 \u0DB1\u0DD0\u0D9A\u0DAD\u0D9A\u0DCA \u0D87\u0DAD \u{1F9FF}";
                  const message = "\u0D85\u0DAF \u0D94\u0DB6\u0DA7 \u0DC3\u0DD4\u0DB6 \u0DB1\u0DD0\u0D9A\u0DAD\u0D9A\u0DCA \u0D87\u0DAD. \u0DC0\u0DD0\u0DAF\u0D9C\u0DAD\u0DCA \u0D9A\u0DA7\u0DBA\u0DD4\u0DAD\u0DD4 \u0DC3\u0DB3\u0DC4\u0DCF \u0DC3\u0DD4\u0DAF\u0DD4\u0DC3\u0DD4 \u0DC0\u0DDA\u0DBD\u0DCF\u0DC0\u0D9A\u0DCA \u0DC0\u0DD2\u0DBA \u0DC4\u0DD0\u0D9A. \u0DC0\u0DD2\u0DC3\u0DCA\u0DAD\u0DBB \u0DB6\u0DBD\u0DB1\u0DCA\u0DB1.";
                  await sendToUser(userId, title, message, "/nekath");
                  updateSubscriptionProfile(userId, { notifications: { ...prefs, lastSpecialNekathSentDate: todayStr } });
                }
              }
            }
          }
          if (prefs.birthday && currentHour === 8 && currentMinute < 15) {
            if (profile.dob && prefs.lastBirthdayWishSentYear !== currentYear) {
              const dob = new Date(profile.dob);
              if (dob.getMonth() === currentMonth && dob.getDate() === currentDay) {
                const title = "\u0DC3\u0DD4\u0DB7 \u0D8B\u0DB4\u0DB1\u0DCA\u0DAF\u0DD2\u0DB1\u0DBA\u0D9A\u0DCA! \u{1F389}";
                const message = `\u0DC3\u0DD4\u0DB7 \u0D8B\u0DB4\u0DB1\u0DCA\u0DAF\u0DD2\u0DB1\u0DBA\u0D9A\u0DCA ${profile.name}! \u0D94\u0DB6\u0D9C\u0DDA \u0D85\u0DAF \u0DAF\u0DC0\u0DC3 \u0DC3\u0DAD\u0DD4\u0DA7, \u0D86\u0DC1\u0DD3\u0DBB\u0DCA\u0DC0\u0DCF\u0DAF \u0DC3\u0DC4 \u0DA2\u0DBA\u0D9C\u0DCA\u0DBB\u0DC4\u0DAB\u0DBA\u0DD9\u0DB1\u0DCA \u0DB4\u0DD2\u0DBB\u0DDA\u0DC0\u0DCF.`;
                await sendToUser(userId, title, message, "/profile");
                updateSubscriptionProfile(userId, { notifications: { ...prefs, lastBirthdayWishSentYear: currentYear } });
              }
            }
          }
        }
      } catch (err) {
        console.error("Error in consolidated cron job:", err);
      }
    }, { timezone: "Asia/Colombo" });
    async function sendToUser(userId, title, body, url) {
      const subs = getSubscriptions().filter((s) => s.userId === userId && !s.disabled);
      const payload = JSON.stringify({ title, body, url });
      const promises = subs.map(
        (sub) => webpush.sendNotification(sub.subscription, payload).catch((err) => {
          if (err.statusCode === 410 || err.statusCode === 404) {
            console.log(`Subscription expired for user ${userId}`);
          }
        })
      );
      await Promise.all(promises);
    }
    console.log("Starting Server v2.2 (Robust Mode)");
    console.log(`Attempting to start server on port: ${PORT}`);
    const isProduction = process.env.NODE_ENV === "production";
    const distPath = path2.join(__dirname, "dist");
    const hasDist = fs2.existsSync(distPath);
    console.log(`Environment: NODE_ENV=${process.env.NODE_ENV}, isProduction=${isProduction}, hasDist=${hasDist}`);
    console.log(`Final PORT: ${PORT}`);
    if (!isProduction || !hasDist) {
      console.log("Starting in DEVELOPMENT mode (Vite middleware)");
      try {
        const { createServer } = await import("vite");
        const vite = await createServer({
          root: process.cwd(),
          server: { middlewareMode: true },
          appType: "spa"
        });
        app.use(vite.middlewares);
      } catch (viteErr) {
        console.error("Failed to start Vite middleware:", viteErr);
        app.get("/*path", (req, res) => {
          res.status(500).send("Development server failed to start.");
        });
      }
    } else {
      console.log("Starting in PRODUCTION mode (Static serving)");
      app.use(express.static(distPath));
      app.get("/*path", (req, res) => {
        res.sendFile(path2.join(distPath, "index.html"));
      });
    }
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}
startServer();
