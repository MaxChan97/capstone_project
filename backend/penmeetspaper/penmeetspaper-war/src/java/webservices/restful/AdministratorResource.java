/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.Administrator;
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
import session.AdministratorSessionBeanLocal;

/**
 *
 * @author SHAWN LIM
 */
@Path("admin")
public class AdministratorResource {

    @EJB
    private AdministratorSessionBeanLocal adminSB;

    private JsonObject createJsonObject(String jsonString) {
        JsonReader reader = Json.createReader(new StringReader(jsonString));
        return reader.readObject();
    }

    private Response buildError(Exception e, int statusCode) {
        JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();

        return Response.status(statusCode).entity(exception).type(MediaType.APPLICATION_JSON).build();
    }

    @POST
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createAdmin(@PathParam("id") Long adminId, String jsonString) {
        JsonObject jsonObject = createJsonObject(jsonString);

        String email = jsonObject.getString("email");
        String username = jsonObject.getString("username");
        Administrator admin = new Administrator();
        admin.setEmail(email);
        admin.setUsername(username);

        try {
            String generatedPassword = adminSB.createAdmin(adminId, admin);
            JsonObject pw = Json.createObjectBuilder().add("password", generatedPassword).build();
            return Response.status(200).entity(pw).type(MediaType.APPLICATION_JSON).build();

        } catch (NotValidException | NoResultException e) {
            return buildError(e, 400);
        }
    } // end createAdmin

    @PUT
    @Path("/{id}/deactivate/{adminToDeactivateId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deactivateAdmin(@PathParam("id") Long adminId, @PathParam("adminToDeactivateId") Long deAdminId) {
        try {
            adminSB.deactivateAdmin(adminId, deAdminId);
            return Response.status(204).build();

        } catch (NotValidException | NoResultException e) {
            return buildError(e, 400);
        }
    }

}