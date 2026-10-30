# CloudOps Control Center

A cloud-native Node.js observability dashboard built for a Docker and Kubernetes deployment assignment. It displays live process telemetry and identifies the hostname serving each request, which makes it useful for demonstrating multiple Kubernetes replicas.

## Features
- Responsive dashboard with automatic five-second refresh
- Runtime hostname (container/Pod identity), Node.js version and platform
- Process uptime, request count, RSS memory and V8 heap metrics
- JSON APIs: `/api/status`, `/api/metrics`, `/api/info`
- Kubernetes-friendly `/health` and `/ready` endpoints
- Non-root Docker execution, Docker health check and graceful SIGTERM handling
- Kubernetes Deployment with two replicas, resource requests/limits and probes
- NodePort Service for local cluster access

## Run locally
Requires Node.js 22 or newer.

```bash
npm start
```
Open `http://localhost:3000`.

## Build and run with Docker

```bash
docker build -t cloudops-dashboard:v1 .
docker run -d --name cloudops-dashboard -p 3000:3000 cloudops-dashboard:v1
docker ps
docker logs cloudops-dashboard
curl http://localhost:3000/health
```

## Deploy to Minikube on an EC2 Ubuntu instance

Install Docker, Minikube and kubectl first. Start Minikube with Docker driver:

```bash
minikube start --driver=docker
```

Build the image on the EC2 host and load it into Minikube:

```bash
docker build -t cloudops-dashboard:v1 .
minikube image load cloudops-dashboard:v1
```

Apply Kubernetes resources:

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl rollout status deployment/cloudops-dashboard
kubectl get deployments,pods,services
```

Access through an SSH tunnel (recommended; no public NodePort required). On EC2:

```bash
kubectl port-forward --address 127.0.0.1 service/cloudops-dashboard-service 8080:80
```

On your Windows PC, in a second PowerShell window:

```powershell
ssh -i "C:\path\to\key.pem" -L 8080:127.0.0.1:8080 ubuntu@EC2_PUBLIC_IP
```

Open `http://localhost:8080` in your browser.

## Useful verification commands

```bash
kubectl get pods -o wide
kubectl get deployment cloudops-dashboard
kubectl get service cloudops-dashboard-service
kubectl logs deployment/cloudops-dashboard
kubectl describe deployment cloudops-dashboard
curl http://localhost:3000/api/status
```

## Important notes
- The metrics shown are process-level demo telemetry, not full EC2 or Kubernetes cluster metrics.
- Request count and process metrics are local to each replica; refreshes may be served by different Pods.
- No database or persistent storage is configured; metrics reset when a container restarts.
- This is a self-managed Minikube cluster on EC2, not Amazon EKS.

## Assignment evidence
Capture actual screenshots of Docker image build, `docker ps`, Docker logs, `kubectl get pods`, `kubectl get deployments`, `kubectl get services`, application browser view, and health/API responses. Add your own screenshots and demo video link before submission.
