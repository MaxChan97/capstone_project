/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.LiveChat;
import entity.Stream;
import java.io.StringReader;
import java.util.List;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import session.StreamSessionBeanLocal;

/**
 *
 * @author Max
 */
@Path("stream")
public class StreamResource {

    @EJB
    private StreamSessionBeanLocal streamSBLocal;

    @POST
    @Path("/{streamerId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response startStream(@PathParam("streamerId") Long streamerId, String jsonString) {
        JsonReader reader = Json.createReader(new StringReader(jsonString));
        JsonObject jsonObject = reader.readObject();
        String streamTitle = jsonObject.getString("streamTitle");
        String streamDescription = jsonObject.getString("streamDescription");
        Boolean isPaid = jsonObject.getBoolean("subscribersOnly");
        String accessUrl = jsonObject.getString("accessUrl");
        String thumbnailUrl = jsonObject.getString("thumbnailUrl");

        try {
            Stream newStream = streamSBLocal.createStream(streamerId, streamTitle, streamDescription, isPaid, accessUrl, thumbnailUrl);
            return Response.status(200).entity(newStream).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }

    @PUT
    @Path("/{streamId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response endStream(@PathParam("streamId") Long streamId) {
        try {
            streamSBLocal.endStream(streamId);
            return Response.status(204).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }
    
    @GET
    @Path("/{streamId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getStreamById(@PathParam("streamId") Long streamId) {
        try {
            Stream stream = streamSBLocal.getStreamById(streamId);
            return Response.status(200).entity(stream).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }
    
    @GET
    @Path("/liveChat/{streamId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getLiveChatByStreamId(@PathParam("streamId") Long streamId) {
        try {
            LiveChat liveChat = streamSBLocal.getLiveChatByStreamId(streamId);
            return Response.status(200).entity(liveChat).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }
    
    @POST
    @Path("/liveChat/{streamId}/{senderId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response sendLiveChatMessage(@PathParam("streamId") Long streamId, @PathParam("senderId") Long senderId, String jsonString) {
        JsonReader reader = Json.createReader(new StringReader(jsonString));
        JsonObject jsonObject = reader.readObject();
        String messageBody = jsonObject.getString("messageBody");
        try {
            streamSBLocal.sendLiveChatMessage(streamId, senderId, messageBody);
            return Response.status(204).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }
    
    @PUT
    @Path("/streamInfo/{streamId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editStreamInfo(@PathParam("streamId") Long streamId, String jsonString) {
        JsonReader reader = Json.createReader(new StringReader(jsonString));
        JsonObject jsonObject = reader.readObject();
        String newStreamTitle = jsonObject.getString("streamTitle");
        String newStreamDescription = jsonObject.getString("streamDescription");
        
        try {
            streamSBLocal.editStreamInfo(streamId, newStreamTitle, newStreamDescription);
            return Response.status(204).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }

    @GET
    @Path("/ongoing")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOngoingStreams() {
        try {
            List<Stream> streams = streamSBLocal.getOngoingStreams();
            GenericEntity<List<Stream>> entity = new GenericEntity<List<Stream>>(streams) {
            };

            return Response.status(200).entity(entity).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }

    @GET
    @Path("/ongoing/{personId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPersonOngoingStreams(@PathParam("personId") Long personId) {
        try {
            List<Stream> streams = streamSBLocal.getPersonOngoingStreams(personId);
            GenericEntity<List<Stream>> entity = new GenericEntity<List<Stream>>(streams) {
            };
            
            return Response.status(200).entity(entity).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }
}
