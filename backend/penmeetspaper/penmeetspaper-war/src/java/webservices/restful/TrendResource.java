/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.Trend;
import java.io.StringReader;
import java.util.List;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonReader;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import session.TrendSessionBeanLocal;

/**
 *
 * @author carlc
 */
@Path("trend")
public class TrendResource {

  @EJB
  private TrendSessionBeanLocal trendSessionBean;

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

  @GET
  @Path("/topAllTime")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getTopTrends() {
    List<Trend> topTrends = trendSessionBean.getTopTrends();
//    for (Trend t : topTrends) {
//      Map<Long, Long> map = new HashMap<>();
//      for (Map.Entry<Date, Long> entry : t.getDateCount().entrySet()) {
//        map.put(entry.getKey().getTime(), entry.getValue());
//      }
//    }
//    GenericEntity<List<Trend>> entity = new GenericEntity<List<Trend>>(topTrends) {
//    };
    JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
    for (Trend t : topTrends) {
      Long noOfOccurrences = new Long(0);
      for (Long value : t.getDateCount().values()) {
        noOfOccurrences += value;
      }
      JsonObjectBuilder trendBuilder = Json.createObjectBuilder().add("id", t.getId()).add("hashtag", t.getHashTag()).add("count", noOfOccurrences.toString());
      arrayBuilder.add(trendBuilder);
    }
    JsonArray jsonArray = arrayBuilder.build();

    return Response.status(200).entity(jsonArray).type(MediaType.APPLICATION_JSON).build();
  }
  
  @GET
  @Path("/topToday")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getTodaysTrends() {
    List<Trend> topTrends = trendSessionBean.getTodaysTrends();
    JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
    for (Trend t : topTrends) {
      Long noOfOccurrences = new Long(0);
      for (Long value : t.getDateCount().values()) {
        noOfOccurrences += value;
      }
      JsonObjectBuilder trendBuilder = Json.createObjectBuilder().add("id", t.getId()).add("hashtag", t.getHashTag()).add("count", noOfOccurrences.toString());
      arrayBuilder.add(trendBuilder);
    }
    JsonArray jsonArray = arrayBuilder.build();

    return Response.status(200).entity(jsonArray).type(MediaType.APPLICATION_JSON).build();
  }

}
