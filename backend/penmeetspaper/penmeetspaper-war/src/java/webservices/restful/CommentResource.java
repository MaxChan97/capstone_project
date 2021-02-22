/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.Comment;
import entity.Reply;
import exception.NoResultException;
import exception.NotValidException;
import java.io.StringReader;
import java.util.Date;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import session.CommentSessionBeanLocal;
import session.ReplySessionBeanLocal;

/**
 * REST Web Service
 *
 * @author shawn
 */
@Path("comment")
public class CommentResource {

    @EJB
    private CommentSessionBeanLocal commentSessionLocal;
    @EJB
    private ReplySessionBeanLocal replySessionLocal;

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
    @Path("/{commentId}/person/{personId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editComment(@PathParam("commentId") Long id, @PathParam("personId") Long personId, String jsonString) {
        JsonObject jsonObject = createJsonObject(jsonString);

        String commentBody = jsonObject.getString("commentBody");

        try {
            Comment comment = commentSessionLocal.getComment(id);
            comment.setBody(commentBody);
            commentSessionLocal.updateComment(comment, personId);

            return Response.status(204).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    } // end editComment

    @DELETE
    @Path("/{commentId}/person/{personId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteComment(@PathParam("commentId") Long id, @PathParam("personId") Long personId) {
        try {
            commentSessionLocal.deleteComment(id, personId);

            return Response.status(204).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    } // end deleteComment

    @POST
    @Path("/{commentId}/person/{personId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response replyToComment(@PathParam("commentId") Long id, @PathParam("personId") Long personId, String jsonString) {
        JsonObject jsonObject = createJsonObject(jsonString);

        String replyBody = jsonObject.getString("replyBody");
        try {
            Reply reply = new Reply();
            reply.setBody(replyBody);
            reply.setDatePosted(new Date());

            replySessionLocal.createReplyForComment(personId, personId, reply);

            return Response.status(204).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    } // end replyToComment
}
