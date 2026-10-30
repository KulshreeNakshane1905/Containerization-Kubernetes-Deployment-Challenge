# CloudOps Control Center – Containerization and Kubernetes Deployment

![Docker](https://img.shields.io/badge/Docker-Containerization-2496ED?logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestration-326CE5?logo=kubernetes&logoColor=white)
![Minikube](https://img.shields.io/badge/Minikube-Local_Cluster-2E6D9F?logo=kubernetes&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?logo=node.js&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-EC2-FF9900?logo=amazonaws&logoColor=white)

## 1. Project Overview

**CloudOps Control Center** is a containerized web application deployed on a Kubernetes cluster using Docker and Minikube.

The project demonstrates the practical implementation of containerization and Kubernetes orchestration. The application is packaged into a Docker image and deployed through Kubernetes Deployment and Service resources.

The infrastructure is hosted on an AWS EC2 Ubuntu instance.

### Project Objectives

- Understand application containerization using Docker.
- Create and manage Docker images and containers.
- Set up a Kubernetes cluster using Minikube.
- Deploy applications using Kubernetes Deployment.
- Expose applications using Kubernetes Services.
- Manage application replicas using Kubernetes scaling.
- Understand Kubernetes self-healing capabilities.
- Monitor application health and deployment status.

## 2. Technology Stack

| Technology | Purpose |
|---|---|
| AWS EC2 | Cloud-based virtual machine |
| Ubuntu | Operating system |
| Node.js | Application runtime |
| Docker | Application containerization |
| Kubernetes | Container orchestration |
| Minikube | Local Kubernetes cluster |
| kubectl | Kubernetes command-line tool |
| YAML | Kubernetes configuration |
| Git and GitHub | Version control and project hosting |

## 3. Project Architecture

The application follows this deployment architecture:

```text
                 Developer
                     |
                     |
                  GitHub
                     |
                     |
                  AWS EC2
                   Ubuntu
                     |
                     |
                   Docker
                     |
              Docker Image
                     |
                     |
                 Minikube
              Kubernetes Cluster
                     |
              Kubernetes Deployment
                     |
              ---------------------
              |                   |
           Pod 1                Pod 2
              |                   |
              ---------------------
                     |
              Kubernetes Service
                     |
                Port Forwarding
                     |
                  Browser
                     |
          CloudOps Control Center
```

## 4. Project Directory Structure

```text
cloudops-k8s-dashboard/
│
├── Dockerfile
├── .dockerignore
├── .gitignore
├── package.json
├── server.js
├── README.md
│
├── public/
│   └── index.html
│
└── k8s/
    ├── deployment.yaml
    └── service.yaml
```

### File Description

- **Dockerfile:** Contains instructions to build the Docker image.
- **.dockerignore:** Excludes unnecessary files from the Docker build context.
- **.gitignore:** Prevents unnecessary and sensitive files from being committed.
- **package.json:** Contains application dependencies and project information.
- **server.js:** Main Node.js application server.
- **public/index.html:** Frontend interface of the application.
- **k8s/deployment.yaml:** Defines the Kubernetes Deployment and application replicas.
- **k8s/service.yaml:** Defines the Kubernetes Service for application access.
- **README.md:** Project documentation.

## 5. Infrastructure Setup

The project was deployed on an AWS EC2 virtual machine.

### Infrastructure Details

| Component | Configuration |
|---|---|
| Cloud Provider | AWS |
| Service | EC2 |
| Operating System | Ubuntu 26.04 LTS |
| Architecture | x86_64 |
| Instance Type | t3.small |
| Storage | 30 GB |
| Container Runtime | Docker |
| Kubernetes Environment | Minikube |

### Connect to AWS EC2

Connect to the Ubuntu instance using SSH:

```bash
ssh ubuntu@YOUR_EC2_PUBLIC_IP
```

Replace `YOUR_EC2_PUBLIC_IP` with your instance's public IP address.

## 6. Docker Installation and Configuration

Check the Docker version:

```bash
docker --version
```

Check Docker information:

```bash
docker info
```

Build the Docker image:

```bash
docker build -t cloudops-dashboard:v1 .
```

List Docker images:

```bash
docker images
```

Run the application container:

```bash
docker run -d --name cloudops-test -p 3000:3000 cloudops-dashboard:v1
```

Verify the running container:

```bash
docker ps
```

Test the application:

```bash
curl http://localhost:3000/ready
curl http://localhost:3000/api/status
curl http://localhost:3000/api/metrics
curl http://localhost:3000/api/info
```

Stop and remove the test container:

```bash
docker stop cloudops-test
docker rm cloudops-test
```

## 7. Minikube Installation and Configuration

Minikube is used to create a Kubernetes cluster on the AWS EC2 instance.

Verify Minikube installation:

```bash
minikube version
```

Start the Minikube cluster:

```bash
minikube start --driver=docker --memory=1800mb --cpus=2
```

Check the cluster status:

```bash
minikube status
```

Verify kubectl:

```bash
kubectl version --client
```

Check Kubernetes nodes:

```bash
kubectl get nodes
```

## 8. Load Docker Image into Minikube

Load the locally built Docker image into Minikube:

```bash
minikube image load cloudops-dashboard:v1
```

Verify the image:

```bash
minikube image ls
```

This allows Kubernetes to use the application image without pulling it from an external container registry.

## 9. Kubernetes Deployment

The Kubernetes Deployment manages the application Pods and maintains the desired number of replicas.

Apply the Deployment configuration:

```bash
kubectl apply -f k8s/deployment.yaml
```

Verify the Deployment:

```bash
kubectl get deployments
```

Check the running Pods:

```bash
kubectl get pods -o wide
```

Describe the Deployment:

```bash
kubectl describe deployment cloudops-dashboard
```

### Deployment Configuration

The application is configured to run with two replicas.

This provides multiple running instances of the application and allows Kubernetes to maintain the desired replica count.

## 10. Kubernetes Service

A Kubernetes Service provides a stable network endpoint for accessing the application Pods.

Apply the Service configuration:

```bash
kubectl apply -f k8s/service.yaml
```

Verify the Service:

```bash
kubectl get services
```

Describe the Service:

```bash
kubectl describe service cloudops-dashboard-service
```

Check Service endpoints:

```bash
kubectl get endpoints cloudops-dashboard-service
```

The application Service is configured using the NodePort service type.

## 11. Access the Application

Use Kubernetes port forwarding to access the application.

Execute:

```bash
kubectl port-forward --address 127.0.0.1 service/cloudops-dashboard-service 8080:80
```

Keep the command running.

For remote access through a local computer, create an SSH tunnel:

```bash
ssh -N -L 8080:127.0.0.1:8080 ubuntu@YOUR_EC2_PUBLIC_IP
```

Open the following address in a browser:

```text
http://localhost:8080
```

The CloudOps Control Center application should be accessible through the browser.

## 12. Application API Testing

The application provides endpoints for checking application readiness and status.

Test the readiness endpoint:

```bash
curl http://127.0.0.1:8080/ready
```

Test application status:

```bash
curl http://127.0.0.1:8080/api/status
```

Test application metrics:

```bash
curl http://127.0.0.1:8080/api/metrics
```

Test application information:

```bash
curl http://127.0.0.1:8080/api/info
```

## 13. Kubernetes Monitoring and Logs

Check all Kubernetes resources:

```bash
kubectl get all
```

View application logs:

```bash
kubectl logs deployment/cloudops-dashboard
```

Monitor Pods:

```bash
kubectl get pods -w
```

View detailed Pod information:

```bash
kubectl describe pods
```

Monitor Deployment:

```bash
kubectl get deployments
```

## 14. Kubernetes Scaling

Kubernetes supports scaling application replicas based on deployment requirements.

Scale the application from two replicas to three:

```bash
kubectl scale deployment cloudops-dashboard --replicas=3
```

Verify the Pods:

```bash
kubectl get pods
```

Verify the Deployment:

```bash
kubectl get deployments
```

Scale the application back to two replicas:

```bash
kubectl scale deployment cloudops-dashboard --replicas=2
```

Verify the final replica count:

```bash
kubectl get deployments
```

## 15. Kubernetes Self-Healing

Kubernetes provides self-healing capabilities by automatically replacing failed or deleted Pods when managed by a Deployment.

List the running Pods:

```bash
kubectl get pods
```

Delete one Pod:

```bash
kubectl delete pod POD_NAME
```

Replace `POD_NAME` with the actual name of one running Pod.

Monitor the Pods:

```bash
kubectl get pods -w
```

Kubernetes automatically creates a replacement Pod to maintain the desired replica count.

## 16. Final Verification Commands

Run the following commands to verify the complete deployment:

```bash
docker images
```

```bash
minikube status
```

```bash
kubectl get nodes
```

```bash
kubectl get pods -o wide
```

```bash
kubectl get deployments
```

```bash
kubectl get services
```

```bash
kubectl get endpoints cloudops-dashboard-service
```

```bash
kubectl get all
```

## 17. Troubleshooting

### Check Docker Status

```bash
docker ps
docker images
docker info
```

### Check Minikube Status

```bash
minikube status
minikube logs
```

### Check Kubernetes Pods

```bash
kubectl get pods
kubectl describe pods
kubectl get events --sort-by=.metadata.creationTimestamp
```

### Check Application Logs

```bash
kubectl logs deployment/cloudops-dashboard
```

### Reapply Kubernetes Configuration

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

### Restart the Deployment

```bash
kubectl rollout restart deployment/cloudops-dashboard
```

### Check Deployment Status

```bash
kubectl rollout status deployment/cloudops-dashboard
```

## 18. Stop the Kubernetes Cluster

After completing the demonstration:

```bash
minikube stop
```

This stops the Minikube cluster without deleting the project configuration.

## 19. Learning Outcomes

Through this project, the following concepts were implemented and understood:

- Docker image creation and container execution.
- Application containerization.
- Docker image management.
- Kubernetes cluster setup using Minikube.
- Kubernetes Deployment and Pod management.
- Kubernetes Service configuration.
- Application access through port forwarding.
- Container orchestration.
- Replica scaling.
- Kubernetes self-healing.
- Application monitoring and log inspection.
- Cloud-based deployment using AWS EC2.

## 20. Conclusion

The CloudOps Control Center project demonstrates the practical implementation of containerization and Kubernetes deployment using Docker, Minikube, and AWS EC2.

The Node.js application was packaged into a Docker image and deployed on a Kubernetes cluster. Kubernetes Deployment was used to manage application replicas, while Kubernetes Service provided a stable endpoint for accessing the application.

The project also demonstrates important Kubernetes features, including scaling, Pod management, monitoring, and self-healing.

This implementation provides practical experience with modern DevOps tools and cloud-native application deployment.

---

## Project Information

**Project Name:** CloudOps Control Center

**Assignment:** Containerization and Kubernetes Deployment Challenge

**Developer:** Kulshree Nakshane

**GitHub Username:** KulshreeNakshane1905

**GitHub Repository:** https://github.com/KulshreeNakshane1905/Containerization-Kubernetes-Deployment-Challenge

**Demonstration Link** https://drive.google.com/drive/folders/1a08lf5m_UrCQOoTMb0bvWdVMncRyCBA3?usp=sharing

**Technologies:** AWS EC2, Ubuntu, Docker, Kubernetes, Minikube, kubectl, Node.js

