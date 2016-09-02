import {Injectable} from "@angular/core";
import {NavController, Loading} from "ionic-angular/index";
import {User} from "../user/user";

/**
 * AuthModel where logged in user and token are defined
 * Author: Max Tuzzolino-Smith
 */

@Injectable()
export class AuthModel {

  // Logged in user details
  public user: User;

  // Kong API location
  public static server: string = "https://api.dev.auckland.ac.nz/service";

  // Generic oauth authentication service
  public static authUrl: string = "https://oauth.dev.auckland.ac.nz/identity-proto/oauth2/authorize?client_id=max-identity-app&response_type=token&scope=identity-read&redirect_uri=http://localhost:8100/build/shared/callback/callback.html";

  // Logged in user details (access token + logged in user entity)
  public access_token: string;
  public expires_in: number;

  constructor() {}
}