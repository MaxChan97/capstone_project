/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.AdminLog;
import exception.NoResultException;
import exception.NotValidException;
import java.util.List;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonObject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import session.AdminLogSessionBeanLocal;

/**
 *
 * @author SHAWN LIM
 */
@Path("adminLog")
public class AdminLogResource {

    @EJB
    private AdminLogSessionBeanLocal adminLogSB;

    private Response buildError(Exception e, int statusCode) {
        JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();

        return Response.status(statusCode).entity(exception).type(MediaType.APPLICATION_JSON).build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAdminLogById(@PathParam("id") Long logId) {
        try {
            AdminLog res = adminLogSB.getAdminLogById(logId);
            return Response.status(200).entity(res).type(MediaType.APPLICATION_JSON).build();
        } catch (NotValidException | NoResultException e) {
            return buildError(e, 400);
        }
    }

    @GET
    @Path("/admin/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAdminLogByAdminId(@PathParam("id") Long adminId) {
        try {
            List<AdminLog> results = adminLogSB.getAdminLogByAdminId(adminId);

            GenericEntity<List<AdminLog>> entity = new GenericEntity<List<AdminLog>>(results) {
            };

            return Response.status(200).entity(entity).build();

        } catch (NotValidException | NoResultException e) {
            return buildError(e, 400);
        }
    }

    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllAdminLogs() {
        try {
            List<AdminLog> results = adminLogSB.getAllAdminLogs();

            GenericEntity<List<AdminLog>> entity = new GenericEntity<List<AdminLog>>(results) {
            };

            return Response.status(200).entity(entity).build();
        } catch (NotValidException | NoResultException e) {
            return buildError(e, 400);
        }
    }
}
