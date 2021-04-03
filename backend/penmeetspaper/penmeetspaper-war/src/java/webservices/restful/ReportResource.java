/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.Report;
import enumeration.ReportStateEnum;
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
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
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
            case "USER_REPORT":
                return ReportTypeEnum.USER_REPORT;
            case "COMMUNITY_REPORT":
                return ReportTypeEnum.COMMUNITY_REPORT;
            case "POST_REPORT":
                return ReportTypeEnum.POST_REPORT;
            case "COMMENT_REPORT":
                return ReportTypeEnum.COMMENT_REPORT;
            case "REPLY_REPORT":
                return ReportTypeEnum.REPLY_REPORT;
            case "STREAM_REPORT":
                return ReportTypeEnum.STREAM_REPORT;
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
    } // end createReport

    @PUT
    @Path("/{id}/changeReportState")
    @Produces(MediaType.APPLICATION_JSON)
    public Response changeReportState(@PathParam("id") Long reportId, String jsonString) {

        JsonObject jsonObject = createJsonObject(jsonString);
        String action = jsonObject.getString("action");
        String adminIdStr = jsonObject.getString("adminId");

        try {
            Long adminId = Long.parseLong(adminIdStr);

            if (action.equals("RESOLVED")) {
                reportSB.setReportState(reportId, ReportStateEnum.RESOLVED, adminId);
            } else if (action.equals("VOID")) {
                reportSB.setReportState(reportId, ReportStateEnum.VOID, adminId);
            } else {
                reportSB.setReportState(reportId, ReportStateEnum.PENDING, adminId);
            }
            return Response.status(204).build();

        } catch (NotValidException | NoResultException e) {
            return buildError(e, 400);
        }
    } // end settleReport

}
