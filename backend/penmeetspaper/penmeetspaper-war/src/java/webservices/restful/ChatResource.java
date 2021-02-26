/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.messagingEntities.Chat;
import entity.messagingEntities.Message;
import java.io.StringReader;
import java.util.Date;
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
import session.ChatSessionBeanLocal;

/**
 *
 * @author Max
 */
@Path("chat")
public class ChatResource {

  @EJB
  private ChatSessionBeanLocal chatSBLocal;

  @POST
  @Path("/{senderId}/{recipientId}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response createChat(@PathParam("senderId") Long senderId, @PathParam("recipientId") Long recipientId,
      String jsonString) {
    JsonReader reader = Json.createReader(new StringReader(jsonString));
    JsonObject jsonObject = reader.readObject();
    String messageBody = jsonObject.getString("body");

    Message m = new Message();
    m.setBody(messageBody);
    m.setDateTime(new Date());

    try {
      Chat newChat = chatSBLocal.createChat(senderId, recipientId, m);
      return Response.status(200).entity(newChat).build();
    } catch (Exception e) {
      JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();

      return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
    }
  }

  @POST
  @Path("/file/{senderId}/{recipientId}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response createFileChat(@PathParam("senderId") Long senderId, @PathParam("recipientId") Long recipientId,
      String jsonString) {
    JsonReader reader = Json.createReader(new StringReader(jsonString));
    JsonObject jsonObject = reader.readObject();
    String messageBody = jsonObject.getString("body");
    String fileName = jsonObject.getString("fileName");
    String fileUrl = jsonObject.getString("fileUrl");
    String fileType = jsonObject.getString("fileType");

    Message m = new Message();
    m.setFileName(fileName);
    m.setFileUrl(fileUrl);
    m.setFileType(fileType);
    m.setBody(messageBody);
    m.setDateTime(new Date());

    try {
      Chat newChat = chatSBLocal.createChat(senderId, recipientId, m);
      return Response.status(200).entity(newChat).build();
    } catch (Exception e) {
      JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();

      return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
    }
  }

  @GET
  @Path("/{id}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response getPersonsChat(@PathParam("id") Long personId) {
    try {
      List<Chat> results = chatSBLocal.getPersonsChat(personId);
      GenericEntity<List<Chat>> entity = new GenericEntity<List<Chat>>(results) {
      };

      return Response.status(200).entity(entity).build();
    } catch (Exception e) {
      JsonObject exception = Json.createObjectBuilder()
              .add("error", e.getMessage())
              .build();

      return Response.status(404).entity(exception)
              .type(MediaType.APPLICATION_JSON).build();
    }

  @PUT
  @Path("/{id}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response setAllMessagesAsOpened(@PathParam("id") Long chatId) {
    try {
      chatSBLocal.setAllMessagesAsOpened(chatId);

      return Response.status(204).build();
    } catch (Exception e) {
      JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();

      return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
    }

  }
}
