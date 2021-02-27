/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import exception.NoResultException;
import exception.NotValidException;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonObject;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import session.SubscriptionSessionBeanLocal;

/**
 *
 * @author shawn
 */
@Path("subscription")
public class SubscriptionResource {

    @EJB
    private SubscriptionSessionBeanLocal subscriptionSB;

    private Response buildError(Exception e, int statusCode) {
        JsonObject exception = Json.createObjectBuilder()
                .add("error", e.getMessage())
                .build();

        return Response.status(statusCode).entity(exception)
                .type(MediaType.APPLICATION_JSON).build();
    }

    @POST
    @Path("/subscriber/{subscriberId}/publisher/{publisherId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response subscribeToPerson(@PathParam("subscriberId") Long subscriberId, @PathParam("publisherId") Long publisherId) {
        try {

            subscriptionSB.subscribeToPerson(subscriberId, publisherId);
            return Response.status(204).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    }

    @DELETE
    @Path("/subscriber/{subscriberId}/publisher/{publisherId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response unsubscribeToPerson(@PathParam("subscriberId") Long subscriberId, @PathParam("publisherId") Long publisherId) {
        try {

            subscriptionSB.unsubscribeToPerson(subscriberId, publisherId);
            return Response.status(204).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    }

}
