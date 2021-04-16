/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.Video;
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
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import session.VideoSessionBeanLocal;

/**
 * REST Web Service
 *
 * @author carlc
 */
@Path("video")
public class VideoResource {

  @EJB
  private VideoSessionBeanLocal videoSessionBean;

  private JsonObject createJsonObject(String jsonString) {
    JsonReader reader = Json.createReader(new StringReader(jsonString));
    return reader.readObject();
  }

  private Response buildError(Exception e, int statusCode) {
    JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();

    return Response.status(statusCode).entity(exception).type(MediaType.APPLICATION_JSON).build();
  }

  @POST
  @Path("/upload")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response createVideoForPerson(String jsonString) {
    JsonObject jsonObject = createJsonObject(jsonString);

    String personId = jsonObject.getString("id");
    String title = jsonObject.getString("title");
    String description = jsonObject.getString("description");
    String fileName = jsonObject.getString("fileName");
    String fileUrl = jsonObject.getString("fileUrl");
    String fileType = jsonObject.getString("fileType");

    Video v = new Video();
    v.setTitle(title);
    v.setDescription(description);
    v.setFileName(fileName);
    v.setFileUrl(fileUrl);
    v.setFileType(fileType);
    v.setIsPaid(false);
    v.setDatePosted(new Date());

    try {
      videoSessionBean.createVideoForPerson(Long.valueOf(personId), v);
      return Response.status(204).build();
    } catch (NoResultException | NotValidException e) {
      return buildError(e, 400);
    }
  } // end createVideoForPerson

  @GET
  @Path("/person/{id}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getPersonsVideos(@PathParam("id") Long personId) {
    try {

      List<Video> results = videoSessionBean.getPersonsVideos(personId);
      GenericEntity<List<Video>> entity = new GenericEntity<List<Video>>(results) {
      };

      return Response.status(200).entity(entity).build();

    } catch (NoResultException | NotValidException e) {
      return buildError(e, 400);
    }
  } // end getPersonsVideos

}
