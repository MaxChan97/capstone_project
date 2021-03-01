/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import java.io.StringReader;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.ws.rs.Consumes;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import session.PollSessionBeanLocal;

/**
 *
 * @author Max
 */
@Path("poll")
public class PollResource {

    @EJB
    private PollSessionBeanLocal pollSBLocal;

    private JsonObject createJsonObject(String jsonString) {
        JsonReader reader = Json.createReader(new StringReader(jsonString));
        return reader.readObject();
    }

    private Response buildError(Exception e, int statusCode) {
        JsonObject exception = Json.createObjectBuilder()
                .add("error", e.getMessage())
                .build();

        return Response.status(statusCode).entity(exception)
                .type(MediaType.APPLICATION_JSON).build();
    }

    @PUT
    @Path("/{pollId}/person/{personId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response voteOnPoll(@PathParam("personId") Long personId, @PathParam("pollId") Long pollId, String jsonString) {
        JsonObject jsonObject = createJsonObject(jsonString);
        
        String optionVoted = jsonObject.getString("optionVoted");
        
        try {
            pollSBLocal.voteOnPoll(personId, pollId, optionVoted);
            return Response.status(204).build();
        } catch (Exception e) {
            return buildError(e, 400);
        }
    }
}
