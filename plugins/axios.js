export default function ({$axios, store}) {
	$axios.onError(error => {
		if (error.response.status === 422) {
			store.dispatch('validation/setErrors', error.response.data.errors);
		}else if(error.response.status === 401){
			store.dispatch('validation/setLoginErrors', error.response.data);
		}
		return Promise.reject(error);
	});

	$axios.onRequest(() => {
		store.dispatch('validation/clearErrors');
	});
}