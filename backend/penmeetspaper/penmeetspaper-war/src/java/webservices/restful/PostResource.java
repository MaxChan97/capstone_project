/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.Post;
import exception.NoResultException;
import exception.NotValidException;
import java.io.StringReader;
import java.util.Date;
import java.util.List;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import session.PostSessionBeanLocal;

/**
 *
 * @author Max
 */
@Path("post")
public class PostResource {

    @EJB
    private PostSessionBeanLocal postSBLocal;

    @POST
    @Path("/person/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createPostForPerson(@PathParam("id") Long personId, String jsonString) {
        JsonReader reader = Json.createReader(new StringReader(jsonString));
        JsonObject jsonObject = reader.readObject();
        String postBody = jsonObject.getString("postBody");
        Post p = new Post();
        p.setBody(postBody);
        p.setDatePosted(new Date());
        try {
            postSBLocal.createPostForPerson(personId, p);
            return Response.status(204).build();
        } catch (NoResultException | NotValidException e) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", e.getMessage())
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    }

    @GET
    @Path("/person/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPersonsPost(@PathParam("id") Long personId) {
        try {
            List<Post> results = postSBLocal.getPersonsPost(personId);
            GenericEntity<List<Post>> entity = new GenericEntity<List<Post>>(results) {
            };

            return Response.status(200).entity(entity).build();
        } catch (NoResultException | NotValidException e) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", e.getMessage())
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    }

    @PUT
    @Path("/person/{personId}/edit/{postId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editPersonsPost(@PathParam("personId") Long personId, @PathParam("postId") Long postId, Post p) {
        p.setId(postId);

        try {

            postSBLocal.updatePost(p, personId);
            return Response.status(204).build();

        } catch (NoResultException | NotValidException e) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", e.getMessage())
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }

    }

    @DELETE
    @Path("/person/{personId}/{postId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deletePersonsPost(@PathParam("personId") Long personId, @PathParam("postId") Long postId) {
        try {
            postSBLocal.deletePostForPerson(postId, personId);
            return Response.status(204).build();
        } catch (NoResultException | NotValidException e) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", e.getMessage())
                    .build();

            return Response.status(404).entity(exception)
                    .type(MediaType.APPLICATION_JSON).build();
        }
    }
}
