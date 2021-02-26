import React from "react";
import avi from "../assets/fileTypes/avi.png";
import css from "../assets/fileTypes/css.png";
import csv from "../assets/fileTypes/csv.png";
import doc from "../assets/fileTypes/doc.png";
import exe from "../assets/fileTypes/exe.png";
import file from "../assets/fileTypes/file.png";
import fla from "../assets/fileTypes/fla.png";
import html from "../assets/fileTypes/html.png";
import iso from "../assets/fileTypes/iso.png";
import js from "../assets/fileTypes/javascript.png";
import jpg from "../assets/fileTypes/jpg.png";
import json from "../assets/fileTypes/json-file.png";
import mp3 from "../assets/fileTypes/mp3.png";
import mp4 from "../assets/fileTypes/mp4.png";
import pdf from "../assets/fileTypes/pdf.png";
import png from "../assets/fileTypes/png.png";
import ppt from "../assets/fileTypes/ppt.png";
import svg from "../assets/fileTypes/svg.png";
import txt from "../assets/fileTypes/txt.png";
import xls from "../assets/fileTypes/xls.png";
import xml from "../assets/fileTypes/xml.png";
import zip from "../assets/fileTypes/zip.png";

export default function FileTypes({ data }) {
  function renderSwitch(type) {
    switch (type) {
      case "avi":
        return avi;
      case "css":
        return css;
      case "csv":
        return csv;
      case "doc":
        return doc;
      case "docx":
        return doc;
      case "exe":
        return exe;
      case "fla":
        return fla;
      case "html":
        return html;
      case "iso":
        return iso;
      case "json":
        return json;
      case "mp3":
        return mp3;
      case "mp4":
        return mp4;
      case "pdf":
        return pdf;
      case "png":
        return png;
      case "ppt":
        return ppt;
      case "txt":
        return txt;
      case "xls":
        return xls;
      case "xlsx":
        return xls;
      case "xml":
        return xml;
      case "zip":
        return zip;
      default:
        return file;
    }
  }

  return (
    <div>
      <img
        className="mx-auto d-block"
        style={{ height: "150px" }}
        src={renderSwitch(data)}
      ></img>
    </div>
  );
}
