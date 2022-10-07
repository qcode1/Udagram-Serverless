
import { CustomAuthorizerEvent, APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult, CustomAuthorizerResult } from 'aws-lambda'

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJOE2JFw2E10MLMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1sZGVlY2FjdS51cy5hdXRoMC5jb20wHhcNMjIxMDAyMTAzOTIxWhcN
MzYwNjEwMTAzOTIxWjAkMSIwIAYDVQQDExlkZXYtbGRlZWNhY3UudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApGrMSbqhbqZkmjFU
QLElgbbvSlMBZydpgfFr931/jOmRngWGN4t7LYsmTS4rkTWZGv8OskwwAiqkLPxy
qBILATIzU5FT+krx4LPmCcZwtcGRWkbOFY8imJDQ8aqqc9uiNmh95hDrZijy90jT
nR1jnPRlBvMO6LtVaO9y11l9Wu3p84AaXKc4D+UVHuUVsHWnwmf+u9/hWaKMlYCY
gdRQ7mfyZaawhFrNjWsVu5jjVOhX3aM8gfiHj6nM92P/XPpTXABQk0VHQaefiIfj
7kmAier/tPGtAf/5XCgomj0MS0Oj6HdOx4yFTvCb+p/rws9cNoF9UmOCSSL/vwv5
FUCkfQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBT5p5lQlgH0
FWrfFdh7N8Hvz3AIGTAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
ADu4WYtfYeTJj/iRwEhRAR33HwJxanGeDRBFoVW0llxvIaw9IFmcaOHPVxBDo6JJ
FgDmGBKU/ExymSNR6gS7S2jvFa6YVd9RasQ0/JpU+J7dBdOsohhBNzoqEXjaZ/Hz
ND4psS9EwYpA93wiixbXZMnFI6/53U5PQlb6DoXRDrjyH07oNO4+gZ18hlOzuJiH
RRv6YepiEUQWc8x9VyOv+kGmEBjPFPf/hmGWNXnRNv/FkOGwsNHI9OU5mahSh46/
dqIFv11CYLK61VP5ozfjdqBUo+DxCdLY8FH7fDdDEiOmPXsZyIhnWK3WfVL4mrnR
NbjOmiw2kTlF9MNI1WEx9u4=
-----END CERTIFICATE-----`

export const handler = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtToken {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}
