package rest.response;

import com.google.gson.JsonElement;

public class ResponseEntity {
    private ResponseStatus status;
    private String message;
    private JsonElement data;

    public ResponseEntity(ResponseStatus status, String msg, JsonElement data) {
        this.status = status;
        this.message = msg;
        this.data = data;
    }

    public ResponseEntity(ResponseStatus status, String msg) {
        this.status = status;
        this.message = msg;
    }
}
