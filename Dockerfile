FROM golang:alpine as build

ENV GOPROXY=https://proxy.golang.com.cn,direct
# Redundant, current golang images already include ca-certificates
RUN apk --no-cache add ca-certificates
WORKDIR /go/src/app
COPY *.go .
COPY go.mod go.mod 
COPY go.sum go.sum 
COPY ./cmd ./cmd 
COPY ./web/dist ./web/dist 
RUN CGO_ENABLED=0 go build -a -installsuffix cgo -o out/main ./cmd/main.go

FROM scratch
# copy the ca-certificate.crt from the build stage
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=build /go/src/app/out/main /main
COPY --from=build /go/src/app/web/dist /web/dist
EXPOSE 8081/tcp
ENTRYPOINT ["/main"]
