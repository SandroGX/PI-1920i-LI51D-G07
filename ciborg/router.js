'use strict'

const get = {
        nextSegments: {}
};
const post = {
        nextSegments: {}
};
const put = {
        nextSegments: {}
};
const delet = {
        nextSegments: {}
};

function add (op, path, resource)
{
	const segments = path.split('/');

	if(segments[0] != '')
		return;
	
	if(op.nextSegments[segments[0]] === undefined) {
		op.nextSegments[segments[0]] = {
			segment: segments[0],
			nextSegments: { },
			nextVarSegment: null,
			resource: resourceNotFound
		}
	}
	
	let curr = op.nextSegments[segments[0]];

	if(segments[1] === '') {
		curr.resource = resource;
		return;
	}

	for(let i = 1; i < segments.length; ++i)
	{
		if (curr.nextSegments[segments[i]] !== undefined)
			curr = curr.nextSegments[segments[i]];
		else {
			let c = {
				segment: segments[i],
				nextSegments: { },
				nextVarSegment: null,
				resource: resourceNotFound,
			};

			if (c.segment.charAt(0) === ':') {
				c.segment = c.segment.substring(1, c.segment.length);
				curr.nextVarSegment = c;
			}
			else
				curr.nextSegments[segments[i]] = c;
	
			curr = c;
		}
	}

  	curr.resource = resource;
}

function getResource (op, req, res)
{
	req.routerParameters = {};
	let curr = op;
	let path = null;
	let queryString = null; 
	let fragment = null;

	const pqf = req.url.split('?');
	path = pqf[0];
	if(pqf[1] !== undefined) {
		const qf = pqf[1].split('#');
		queryString = qf[0];
		if(qf[1] !== undefined)
			fragment = qf[1];
	}

	const segments = path.split('/');

	//get resource at path
	for(let i = 0; i < segments.length; ++i)
	{
		if (curr.nextSegments[segments[i]] !== undefined) {
			curr = curr.nextSegments[segments[i]];
		} else if(curr.nextVarSegment) {
			curr = curr.nextVarSegment;
			req.routerParameters[curr.segment] = segments[i];
		}
		else {
			resourceNotFound(req, res);
			return;
		}
	}

	//get request queries
	if(queryString) {
		req.queryParameters = {};
		const queries = queryString.split('&');
		for(let i = 0; i < queries.length; ++i) {
			const query = queries[i].split('='); 
			req.queryParameters[query[0]] = query[1];
		}
	}

	//get fragment
	if(fragment)
		req.fragment = fragment;

	curr.resource(req, res);
}

function resourceNotFound(req, res){
	res.writeHead(404);
	res.end("Error, the URL doesn't exist");
}

function router (req, res) {
	if (req.method === 'GET') {
	  getResource(get, req, res);
   	}
	else if (req.method === 'POST') {
	  getResource(post, req, res);
	}
	else if (req.method === 'PUT') {
	  getResource(put, req, res);
  	}
	else if (req.method === 'DELETE') {
	  getResource(delet, req, res);
  	} else {
		res.writeHead(501);
		res.end("Method Not Supported");
	}

}

router.get = function addGet (path, resource) { add(get, path, resource); }
router.post = function addPost (path, resource) { add(post, path, resource); }
router.put = function addPut (path, resource) { add(put, path, resource); }
router.delete = function addDelete (path, resource) { add(delet, path, resource); }

module.exports = router;

/*
{
  segment: string
  nextSegments: {}
  nextVarSegment: o
  resource: o
}

{
	routerVariables: {}
}
*/