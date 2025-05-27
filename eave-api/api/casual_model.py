# model.py
import torch, pyro
import pyro.distributions as dist
from pyro.nn import PyroModule, PyroSample

class CausalBNN(PyroModule):
    def __init__(self):
        super().__init__()
        self.hidden = PyroModule[torch.nn.Linear](19, 10)
        self.hidden.weight = PyroSample(dist.Normal(0.,1.)
                                        .expand([10,19]).to_event(2))
        self.hidden.bias   = PyroSample(dist.Normal(0.,1.)
                                        .expand([10]).to_event(1))
        self.out = PyroModule[torch.nn.Linear](10,1)
        self.out.weight = PyroSample(dist.Normal(0.,1.)
                                     .expand([1,10]).to_event(2))
        self.out.bias   = PyroSample(dist.Normal(0.,1.)
                                     .expand([1]).to_event(1))

    def forward(self, x, y=None):
        h = torch.relu(self.hidden(x))
        μ = self.out(h).squeeze(-1)
        σ = pyro.sample("sigma", dist.Uniform(0.,10.))
        with pyro.plate("data", x.shape[0]):
            pyro.sample("obs", dist.Normal(μ, σ), obs=y)
        return μ
