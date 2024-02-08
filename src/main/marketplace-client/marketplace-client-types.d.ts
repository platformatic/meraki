export interface FullResponse<T, U extends number> {
  'statusCode': U;
  'headers': object;
  'body': T;
}

export type GetOrganizationsRequest = {
  'authorization': string;
}

export type GetOrganizationsResponseOK = Array<{ 'id'?: string; 'name'?: string; 'email'?: string; 'personal'?: boolean; 'plan'?: string; 'deletedAt'?: unknown }>
export type GetOrganizationsResponseInternalServerError = {
  'error': string;
  'statusCode'?: number;
  'message'?: string;
}
export type GetOrganizationsResponses =
  FullResponse<GetOrganizationsResponseOK, 200>
  | FullResponse<GetOrganizationsResponseInternalServerError, 500>

export type PostOrganizationsRequest = {
  'authorization': string;
  'name': string;
  'email'?: string;
  'plan'?: string;
}

export type PostOrganizationsResponseCreated = {
  'id': string;
  'name': string;
  'email': string;
  'personal': boolean;
  'plan': string;
  'deletedAt': unknown;
}
export type PostOrganizationsResponseInternalServerError = {
  'error': string;
  'statusCode'?: number;
  'message'?: string;
}
export type PostOrganizationsResponses =
  FullResponse<PostOrganizationsResponseCreated, 201>
  | FullResponse<PostOrganizationsResponseInternalServerError, 500>

export type PutOrganizationsRequest = {
  'authorization': string;
  'id': string;
  'name': string;
  'email'?: string;
}

export type PutOrganizationsResponseCreated = {
  'id': string;
  'name': string;
  'email': string;
  'personal': boolean;
  'plan': string;
  'deletedAt': unknown;
}
export type PutOrganizationsResponseInternalServerError = {
  'error': string;
  'statusCode'?: number;
  'message'?: string;
}
export type PutOrganizationsResponses =
  FullResponse<PutOrganizationsResponseCreated, 201>
  | FullResponse<PutOrganizationsResponseInternalServerError, 500>

export type DeleteOrganizationsOrgIdRequest = {
  'authorization': string;
  'orgId': string;
}

export type DeleteOrganizationsOrgIdResponseCreated = {
  'id': string;
  'name': string;
  'email': string;
  'personal': boolean;
  'plan': string;
  'deletedAt': unknown;
}
export type DeleteOrganizationsOrgIdResponseInternalServerError = {
  'error': string;
  'statusCode'?: number;
  'message'?: string;
}
export type DeleteOrganizationsOrgIdResponses =
  FullResponse<DeleteOrganizationsOrgIdResponseCreated, 201>
  | FullResponse<DeleteOrganizationsOrgIdResponseInternalServerError, 500>

export type GetOrganizationsOrgIdUsersRequest = {
  'authorization': string;
  'orgId': string;
}

export type GetOrganizationsOrgIdUsersResponseOK = Array<{ 'id'?: string; 'username'?: string; 'email'?: string; 'role'?: string; 'createdAt'?: string; 'status'?: string }>
export type GetOrganizationsOrgIdUsersResponses =
  FullResponse<GetOrganizationsOrgIdUsersResponseOK, 200>

export type PutOrganizationsOrgIdUsersUserIdRequest = {
  'orgId': string;
  'userId': string;
  'role': 'owner' | 'admin' | 'user';
}

export type PutOrganizationsOrgIdUsersUserIdResponseOK = {
  'id': string;
  'username': string;
  'email': string;
  'role': string;
  'createdAt': string;
  'status': string;
}
export type PutOrganizationsOrgIdUsersUserIdResponses =
  FullResponse<PutOrganizationsOrgIdUsersUserIdResponseOK, 200>

export type DeleteOrganizationsOrgIdUsersUserIdRequest = {
  'orgId': string;
  'userId': string;
}

export type DeleteOrganizationsOrgIdUsersUserIdResponseOK = {
  'id': string;
}
export type DeleteOrganizationsOrgIdUsersUserIdResponses =
  FullResponse<DeleteOrganizationsOrgIdUsersUserIdResponseOK, 200>

export type PostOrganizationsOrgIdInviteRequest = {
  'orgId': string;
  'email': string;
}

export type PostOrganizationsOrgIdInviteResponseOK = {
  'id': string;
}
export type PostOrganizationsOrgIdInviteResponses =
  FullResponse<PostOrganizationsOrgIdInviteResponseOK, 200>

export type PutOrganizationsOrgIdOwnerRequest = {
  'orgId': string;
  'userId': string;
}

export type PutOrganizationsOrgIdOwnerResponseOK = {
  'id': string;
  'username': string;
  'email': string;
  'role': string;
  'createdAt': string;
  'status': string;
}
export type PutOrganizationsOrgIdOwnerResponses =
  FullResponse<PutOrganizationsOrgIdOwnerResponseOK, 200>

export type GetPluginsRequest = {
  'search'?: string;
}

export type GetPluginsResponseOK = Array<{ 'id'?: string; 'name'?: string; 'description'?: string; 'author'?: string; 'homepage'?: string; 'tags'?: Array<string>; 'latestVersion'?: string; 'createdAt'?: string; 'releasedAt'?: string; 'downloads'?: number; 'supportedBy'?: string; 'supportedByUrl'?: string; 'supportedByIcon'?: string; 'envVars'?: Array<{ 'name'?: string; 'path'?: string; 'type'?: string | number | boolean; 'description'?: string; 'default'?: string }> }>
export type GetPluginsResponses =
  FullResponse<GetPluginsResponseOK, 200>

export type GetPluginsIdRequest = {
  'id': string;
}

export type GetPluginsIdResponseOK = Array<{ 'id'?: string; 'name'?: string; 'description'?: string; 'author'?: string; 'homepage'?: string; 'tags'?: Array<string>; 'latestVersion'?: string; 'createdAt'?: string; 'releasedAt'?: string; 'downloads'?: number; 'supportedBy'?: string; 'supportedByUrl'?: string; 'supportedByIcon'?: string; 'envVars'?: Array<{ 'name'?: string; 'path'?: string; 'type'?: string | number | boolean; 'description'?: string; 'default'?: string }> }>
export type GetPluginsIdResponses =
  FullResponse<GetPluginsIdResponseOK, 200>

export type GetProfileRequest = {
  'refresh'?: boolean;
}

export type GetTemplatesRequest = {
  'search'?: string;
  'authorization'?: string;
  'x-platformatic-user-api-key'?: string;
}

export type GetTemplatesResponseOK = Array<{ 'id'?: string; 'name'?: string; 'description'?: string; 'author'?: string; 'homepage'?: string; 'orgId'?: string; 'orgName'?: string; 'public'?: boolean; 'platformaticService'?: boolean; 'tags'?: Array<string>; 'downloads'?: number; 'latestVersion'?: string; 'createdAt'?: string; 'releasedAt'?: string; 'publicRequest'?: boolean; 'rejected'?: boolean; 'supportedBy'?: string; 'supportedByUrl'?: string; 'supportedByIcon'?: string }>
export type GetTemplatesResponses =
  FullResponse<GetTemplatesResponseOK, 200>

export type GetTemplatesIdRequest = {
  'id': string;
}

export type GetTemplatesIdResponseOK = Array<{ 'id'?: string; 'name'?: string; 'description'?: string; 'author'?: string; 'homepage'?: string; 'orgId'?: string; 'orgName'?: string; 'public'?: boolean; 'platformaticService'?: boolean; 'tags'?: Array<string>; 'downloads'?: number; 'latestVersion'?: string; 'createdAt'?: string; 'releasedAt'?: string; 'publicRequest'?: boolean; 'rejected'?: boolean; 'supportedBy'?: string; 'supportedByUrl'?: string; 'supportedByIcon'?: string }>
export type GetTemplatesIdResponses =
  FullResponse<GetTemplatesIdResponseOK, 200>

export type DeleteTemplatesIdRequest = {
  'authorization': string;
  'id': string;
}

export type DeleteTemplatesIdResponseOK = {
  'id': string;
  'name': string;
  'description': string;
  'author': string;
  'homepage': string;
  'orgId': string;
  'orgName': string;
  'public': boolean;
  'platformaticService': boolean;
  'tags': Array<string>;
  'downloads': number;
  'latestVersion': string;
  'createdAt': string;
  'releasedAt': string;
  'publicRequest': boolean;
  'rejected': boolean;
  'supportedBy': string;
  'supportedByUrl': string;
  'supportedByIcon': string;
}
export type DeleteTemplatesIdResponses =
  FullResponse<DeleteTemplatesIdResponseOK, 200>

export type PostTemplatesIdRequest = {
  'authorization': string;
  'id': string;
  'tags': Array<string>;
  'description': string;
}

export type PostTemplatesIdResponseOK = {
  'id': string;
  'name': string;
  'description': string;
  'author': string;
  'homepage': string;
  'orgId': string;
  'orgName': string;
  'public': boolean;
  'platformaticService': boolean;
  'tags': Array<string>;
  'downloads': number;
  'latestVersion': string;
  'createdAt': string;
  'releasedAt': string;
  'publicRequest': boolean;
  'rejected': boolean;
  'supportedBy': string;
  'supportedByUrl': string;
  'supportedByIcon': string;
}
export type PostTemplatesIdResponses =
  FullResponse<PostTemplatesIdResponseOK, 200>

export type PostTemplatesVerifyRequest = {
  'authorization': string;
  'name': string;
}

export type PostTemplatesVerifyResponseOK = {
  'name': string;
  'description': string;
  'author': string;
  'homepage': string;
  'tags': Array<string>;
  'downloads': string;
  'releasedAt': string;
  'latestVersion': string;
}
export type PostTemplatesVerifyResponses =
  FullResponse<PostTemplatesVerifyResponseOK, 200>

export type PostTemplatesCreateRequest = {
  'authorization': string;
  'orgId': string;
  'name': string;
  'npmPackageName': string;
  'description': string;
  'tags': Array<string>;
  'publicRequest': boolean;
}

export type PatchTemplatesIdNpmPackageRequest = {
  'authorization': string;
  'id': string;
}

export type PatchTemplatesIdNpmPackageResponseOK = {
  'name': string;
  'description': string;
  'author': string;
  'homepage': string;
  'tags': Array<string>;
  'downloads': string;
  'releasedAt': string;
  'latestVersion': string;
}
export type PatchTemplatesIdNpmPackageResponses =
  FullResponse<PatchTemplatesIdNpmPackageResponseOK, 200>

export type GetTermsRequest = {
  'authorization': string;
}

export type GetTermsResponseInternalServerError = {
  'error': string;
  'statusCode'?: number;
  'message'?: string;
}
export type GetTermsdefaultResponse = {
  'success': boolean;
}
export type GetTermsResponses =
  FullResponse<GetTermsResponseInternalServerError, 500>
  | FullResponse<GetTermsdefaultResponse, default>

export type PostTermsRequest = {
  'authorization': string;
}

export type PostTermsResponseInternalServerError = {
  'error': string;
  'statusCode'?: number;
  'message'?: string;
}
export type PostTermsdefaultResponse = {
  'success': boolean;
}
export type PostTermsResponses =
  FullResponse<PostTermsResponseInternalServerError, 500>
  | FullResponse<PostTermsdefaultResponse, default>

export type PostUsersRequest = {
  'authorization': string;
}

export type PostUsersResponseInternalServerError = {
  'error': string;
  'statusCode'?: number;
  'message'?: string;
}
export type PostUsersdefaultResponse = {
  'orgIds': Array<string>;
  'externalId': string;
  'userId': string;
}
export type PostUsersResponses =
  FullResponse<PostUsersResponseInternalServerError, 500>
  | FullResponse<PostUsersdefaultResponse, default>



export interface MarketplaceClient {
  setBaseUrl(newUrl: string) : void;
  getOrganizations(req?: GetOrganizationsRequest): Promise<GetOrganizationsResponses>;
  postOrganizations(req?: PostOrganizationsRequest): Promise<PostOrganizationsResponses>;
  putOrganizations(req?: PutOrganizationsRequest): Promise<PutOrganizationsResponses>;
  deleteOrganizationsOrgId(req?: DeleteOrganizationsOrgIdRequest): Promise<DeleteOrganizationsOrgIdResponses>;
  getOrganizationsOrgIdUsers(req?: GetOrganizationsOrgIdUsersRequest): Promise<GetOrganizationsOrgIdUsersResponses>;
  putOrganizationsOrgIdUsersUserId(req?: PutOrganizationsOrgIdUsersUserIdRequest): Promise<PutOrganizationsOrgIdUsersUserIdResponses>;
  deleteOrganizationsOrgIdUsersUserId(req?: DeleteOrganizationsOrgIdUsersUserIdRequest): Promise<DeleteOrganizationsOrgIdUsersUserIdResponses>;
  postOrganizationsOrgIdInvite(req?: PostOrganizationsOrgIdInviteRequest): Promise<PostOrganizationsOrgIdInviteResponses>;
  putOrganizationsOrgIdOwner(req?: PutOrganizationsOrgIdOwnerRequest): Promise<PutOrganizationsOrgIdOwnerResponses>;
  getPlugins(req?: GetPluginsRequest): Promise<GetPluginsResponses>;
  getPluginsId(req?: GetPluginsIdRequest): Promise<GetPluginsIdResponses>;
  getProfile(req?: GetProfileRequest): Promise<unknown>;
  getTemplates(req?: GetTemplatesRequest): Promise<GetTemplatesResponses>;
  getTemplatesId(req?: GetTemplatesIdRequest): Promise<GetTemplatesIdResponses>;
  deleteTemplatesId(req?: DeleteTemplatesIdRequest): Promise<DeleteTemplatesIdResponses>;
  postTemplatesId(req?: PostTemplatesIdRequest): Promise<PostTemplatesIdResponses>;
  postTemplatesVerify(req?: PostTemplatesVerifyRequest): Promise<PostTemplatesVerifyResponses>;
  postTemplatesCreate(req?: PostTemplatesCreateRequest): Promise<unknown>;
  patchTemplatesIdNpmPackage(req?: PatchTemplatesIdNpmPackageRequest): Promise<PatchTemplatesIdNpmPackageResponses>;
  getTerms(req?: GetTermsRequest): Promise<GetTermsResponses>;
  postTerms(req?: PostTermsRequest): Promise<PostTermsResponses>;
  postUsers(req?: PostUsersRequest): Promise<PostUsersResponses>;
}
type PlatformaticFrontendClient = Omit<Marketplace-client, 'setBaseUrl'>
export default function build(url: string): PlatformaticFrontendClient
