/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.Reply;
import exception.NoResultException;
import exception.NotValidException;
import java.io.StringReader;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import session.ReplySessionBeanLocal;

/**
 *
 * @author shawn
 */
@Path("reply")
public class ReplyResource {

    @EJB
    private ReplySessionBeanLocal replySB;

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
    @Path("/{replyId}/person/{personId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editReply(@PathParam("replyId") Long replyId, @PathParam("personId") Long personId, String jsonString) {
        JsonObject jsonObject = createJsonObject(jsonString);

        String replyBody = jsonObject.getString("replyBody");

        try {
            Reply reply = replySB.getReply(replyId);

            reply.setBody(replyBody);
            replySB.updateReply(reply, personId);

            return Response.status(204).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    } // end editReply

    @DELETE
    @Path("/{replyId}/person/{personId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteComment(@PathParam("replyId") Long replyId, @PathParam("personId") Long personId) {
        try {
            replySB.deleteReply(replyId, personId);

            return Response.status(204).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    } // end deleteReply

    @PUT
    @Path("/{replyId}/person/{personId}/like")
    @Produces(MediaType.APPLICATION_JSON)
    public Response likeReply(@PathParam("replyId") Long replyId, @PathParam("personId") Long personId) {
        try {

            replySB.likeReply(replyId, personId);
            return Response.status(204).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    } // end likeReply

    @PUT
    @Path("/{replyId}/person/{personId}/unlike")
    @Produces(MediaType.APPLICATION_JSON)
    public Response unlikeReply(@PathParam("replyId") Long replyId, @PathParam("personId") Long personId) {
        try {

            replySB.unlikeReply(replyId, personId);
            return Response.status(204).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    } // end unlikeReply

}
