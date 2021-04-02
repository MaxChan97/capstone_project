/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.Report;
import enumeration.ReportTypeEnum;
import exception.NoResultException;
import exception.NotValidException;
import java.io.StringReader;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import session.ReportSessionBeanLocal;

/**
 *
 * @author SHAWN LIM
 */
@Path("report")
public class ReportResource {

    @EJB
    private ReportSessionBeanLocal reportSB;

    private JsonObject createJsonObject(String jsonString) {
        JsonReader reader = Json.createReader(new StringReader(jsonString));
        return reader.readObject();
    }

    private Response buildError(Exception e, int statusCode) {
        JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();

        return Response.status(statusCode).entity(exception).type(MediaType.APPLICATION_JSON).build();
    }

    private ReportTypeEnum convertToReportTypeEnum(String str) throws NotValidException {
        switch (str) {
            case "NOT_EARNING":
                return ReportTypeEnum.USER_REPORT;
            case "LOW":
                return ReportTypeEnum.COMMUNITY_REPORT;
            case "MIDDLE_LOW":
                return ReportTypeEnum.POST_REPORT;
            case "MIDDLE":
                return ReportTypeEnum.COMMENT_REPORT;
            case "MIDDLE_HIGH":
                return ReportTypeEnum.REPLY_REPORT;
            case "HIGH":
                return ReportTypeEnum.STREAM_REPORT;
            case "CRA":
                return ReportTypeEnum.SYSTEM_REPORT;
            default:
                throw new NotValidException("Report type required");
        }
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createReport(String jsonString) {
        JsonObject jsonObject = createJsonObject(jsonString);

        String messageBody = jsonObject.getString("messageBody");
        String reporterIdStr = jsonObject.getString("reporterId");
        String reportTypeStr = jsonObject.getString("reportTypeEnum");
        String reportedContentId = jsonObject.getString("reportedContentId");

        Long reporterId = Long.parseLong(reporterIdStr);

        Report report = new Report();

        try {
            ReportTypeEnum reportType = convertToReportTypeEnum(reportTypeStr);
            report.setMessageBody(messageBody);
            report.setReportContentId(reportedContentId);
            report.setReportType(reportType);

            reportSB.createReport(report, reporterId);
            return Response.status(204).build();

        } catch (NotValidException | NoResultException e) {
            return buildError(e, 400);
        }
    } // end createAdmin

}
