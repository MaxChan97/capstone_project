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
import session.FollowerSessionBeanLocal;

/**
 *
 * @author shawn
 */
@Path("follow")
public class FollowResource {

    @EJB
    private FollowerSessionBeanLocal followSBLocal;

    private Response buildError(Exception e, int statusCode) {
        JsonObject exception = Json.createObjectBuilder()
                .add("error", e.getMessage())
                .build();

        return Response.status(statusCode).entity(exception)
                .type(MediaType.APPLICATION_JSON).build();
    }

    @POST
    @Path("/{followerId}/{publisherId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response followPerson(@PathParam("followerId") Long followerId, @PathParam("publisherId") Long publisherId) {
        try {

            followSBLocal.followPerson(followerId, publisherId);
            return Response.status(204).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    }

    @DELETE
    @Path("/{followerId}/{publisherId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response unfollowPerson(@PathParam("followerId") Long followerId, @PathParam("publisherId") Long publisherId) {
        try {

            followSBLocal.unfollowPerson(followerId, publisherId);
            return Response.status(204).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    }

}
